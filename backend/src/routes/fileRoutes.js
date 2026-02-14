import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readData, writeData } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB max
});

// Upload file
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const fileData = {
    id: Date.now().toString(),
    originalName: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    uploadDate: new Date(),
    price: null,
    downloadCount: 0,
    status: 'pending' // pending, approved
  };

  try {
    const data = readData();
    data.files.push(fileData);
    writeData(data);

    res.json({
      message: 'File uploaded successfully',
      file: fileData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save file metadata' });
  }
});

// Get all files with prices set
router.get('/', (req, res) => {
  try {
    const data = readData();
    const approvedFiles = data.files.filter(f => f.status === 'approved' && f.price !== null);
    res.json(approvedFiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// Download file
router.get('/download/:id', (req, res) => {
  try {
    const data = readData();
    const file = data.files.find(f => f.id === req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(__dirname, '../../uploads', file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    // Increment download count
    file.downloadCount = (file.downloadCount || 0) + 1;
    writeData(data);

    res.download(filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});

export default router;
