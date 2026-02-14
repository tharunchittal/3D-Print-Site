import express from 'express';
import { verifyAdminToken } from '../middleware/auth.js';
import { readData, writeData } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Get all files (admin)
router.get('/files', verifyAdminToken, (req, res) => {
  try {
    const data = readData();
    res.json(data.files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// Set price for a file
router.put('/files/:id/price', verifyAdminToken, (req, res) => {
  const { price } = req.body;

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Invalid price' });
  }

  try {
    const data = readData();
    const file = data.files.find(f => f.id === req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    file.price = price;
    file.status = 'approved';
    writeData(data);

    res.json({ message: 'Price set successfully', file });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set price' });
  }
});

// Approve file
router.put('/files/:id/approve', verifyAdminToken, (req, res) => {
  try {
    const data = readData();
    const file = data.files.find(f => f.id === req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    file.status = 'approved';
    writeData(data);

    res.json({ message: 'File approved', file });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve file' });
  }
});

// Reject/Delete file
router.delete('/files/:id', verifyAdminToken, (req, res) => {
  try {
    const data = readData();
    const fileIndex = data.files.findIndex(f => f.id === req.params.id);

    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = data.files[fileIndex];
    const filePath = path.join(__dirname, '../../uploads', file.filename);

    // Delete physical file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from database
    data.files.splice(fileIndex, 1);
    writeData(data);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get file statistics
router.get('/stats', verifyAdminToken, (req, res) => {
  try {
    const data = readData();
    const stats = {
      totalFiles: data.files.length,
      pendingFiles: data.files.filter(f => f.status === 'pending').length,
      approvedFiles: data.files.filter(f => f.status === 'approved').length,
      totalDownloads: data.files.reduce((sum, f) => sum + (f.downloadCount || 0), 0),
      totalSize: data.files.reduce((sum, f) => sum + f.size, 0)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

export default router;
