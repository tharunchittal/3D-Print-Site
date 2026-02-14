# 3D Print Site - Full Stack Application

A complete file upload platform with client upload interface, download management, and admin dashboard for file pricing and management.

## Features

### Client Side
- 📤 Upload files with drag-and-drop support
- 💰 View available files with pricing
- 📥 Download files
- ✨ Clean, responsive Tailwind CSS UI

### Admin Portal
- 🔐 Secure admin login with password authentication
- 📊 Dashboard with statistics (total files, pending, approved, downloads)
- 💵 Set prices for files
- ✅ Approve/reject uploaded files
- 📋 View download counts
- 🗑️ Delete files from system
- 📥 Download files from admin interface

### Backend
- Express.js REST API
- File upload with Multer
- JWT authentication for admin
- JSON file-based storage (easily upgradeable to MongoDB)
- CORS enabled for frontend communication

## Project Structure

```
3D-Print-Site/
├── backend/              # Node.js/Express server
│   ├── src/
│   │   ├── server.js     # Main server file
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Authentication middleware
│   │   └── config/       # Database configuration
│   ├── uploads/          # Uploaded files storage
│   ├── data.json         # File metadata storage
│   └── package.json
├── frontend/             # Client React app
│   ├── src/
│   │   ├── pages/        # Home and Download pages
│   │   └── components/   # Reusable components
│   └── package.json
├── admin/                # Admin React app
│   ├── src/
│   │   ├── pages/        # Login and Dashboard pages
│   │   └── components/   # Admin components
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your settings:
```
PORT=5000
ADMIN_PASSWORD=admin123
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

5. Start the server:
```bash
npm run dev    # With auto-reload
# or
npm start      # Production
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

### Admin Dashboard Setup

1. Navigate to admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The admin panel will open at `http://localhost:3001`

## Usage Guide

### For Clients

1. **Upload Files**:
   - Go to the home page
   - Click the upload area or drag and drop a file
   - Click "Upload File"
   - Wait for admin approval

2. **Download Files**:
   - Navigate to "Download Files" page
   - Browse available files (approved files with prices set)
   - Click "Download" to download any file
   - File will be saved to your downloads folder

### For Admins

1. **Login**:
   - Go to admin portal (typically http://localhost:3001)
   - Enter the admin password (default: `admin123` as per `.env`)
   - You'll be redirected to the dashboard

2. **Manage Files**:
   - **View All Files**: See all uploaded files with their status
   - **Set Prices**: Click "Set Price" on pending files to approve and price them
   - **Edit Prices**: Click "Edit" on approved files to change their price
   - **Download**: Download any file directly from the admin interface
   - **Delete**: Remove files from the system (this deletes the physical file too)

3. **Monitor Stats**:
   - Dashboard shows real-time statistics:
     - Total files uploaded
     - Pending files awaiting approval
     - Approved files
     - Total downloads across all files

## API Endpoints

### File Upload & Download
- `POST /api/files/upload` - Upload a file
- `GET /api/files` - Get all approved files with prices
- `GET /api/files/download/:id` - Download a specific file

### Admin Routes (requires Bearer token)
- `POST /api/auth/admin-login` - Admin login
- `GET /api/admin/files` - Get all files
- `PUT /api/admin/files/:id/price` - Set price for a file
- `PUT /api/admin/files/:id/approve` - Approve a file
- `DELETE /api/admin/files/:id` - Delete a file
- `GET /api/admin/stats` - Get dashboard statistics

## Configuration

### Environment Variables

**Backend (.env)**
```
PORT=5000
ADMIN_PASSWORD=admin123
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

Modify these values as needed for your deployment.

## File Storage

Currently, files are stored locally in the `backend/uploads` directory. The metadata is stored in `backend/data.json`.

To upgrade to a database system like MongoDB:
1. Modify `backend/src/config/database.js`
2. Replace JSON file operations with MongoDB operations
3. No changes needed in the rest of the application

## Security Considerations

For production deployment:

1. **Admin Password**: Change the default password to a strong one
2. **JWT Secret**: Use a strong, random JWT secret
3. **CORS**: Update CORS settings to only allow your frontend domains
4. **File Upload Limits**: Set appropriate file size limits in Multer configuration
5. **Database**: Migrate from JSON to a proper database (MongoDB, PostgreSQL, etc.)
6. **HTTPS**: Use HTTPS in production
7. **Rate Limiting**: Implement rate limiting on API endpoints

## Troubleshooting

### Files not uploading
- Check that the `backend/uploads` directory exists and is writable
- Verify the backend server is running on port 5000
- Check browser console for CORS errors

### Admin login fails
- Verify the admin password in `.env` matches what you're entering
- Clear browser cache and try again
- Check backend server logs

### Frontend not connecting to backend
- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in `backend/src/server.js`
- Verify firewall isn't blocking port 5000

## Future Enhancements

- [ ] User accounts and authentication
- [ ] File preview functionality
- [ ] Search and filtering system
- [ ] File tags and categories
- [ ] Email notifications for uploads
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] File versioning
- [ ] Cloud storage integration (AWS S3, Google Cloud)
- [ ] Docker containerization

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.
