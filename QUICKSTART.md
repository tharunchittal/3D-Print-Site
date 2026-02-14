# Quick Start Guide

This guide will help you get the 3D Print Site running on your machine in just a few minutes.

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- A terminal/command prompt

## Quick Start (5 minutes)

### 1. Clone/Extract the Project

```bash
cd 3D-Print-Site
```

### 2. Run the Setup Script

#### On macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

#### On Windows:
```bash
# Open PowerShell in the project directory and run:
npm install --prefix backend && npm install --prefix frontend && npm install --prefix admin
```

### 3. Start the Services

Open **3 separate terminal windows** in the project root:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
You should see: `Server running on http://localhost:5000`

**Terminal 2 - Client Frontend:**
```bash
cd frontend
npm start
```
This will automatically open `http://localhost:3000` in your browser

**Terminal 3 - Admin Dashboard:**
```bash
cd admin
npm start
```
This will automatically open `http://localhost:3001` in your browser

---

## Usage

### For Clients
1. Go to **http://localhost:3000**
2. Upload a file using the upload form
3. Go to "Download Files" to see available files and their prices
4. Download any file with an assigned price

### For Admins
1. Go to **http://localhost:3001**
2. Login with the default password: **`admin123`**
3. View uploaded files and set prices
4. Download files or delete them as needed

---

## Default Credentials

**Admin Password:** `admin123`

To change it, edit `backend/.env`:
```
ADMIN_PASSWORD=your_new_password
```

Then restart the backend server.

---

## Troubleshooting

### "Port 5000 already in use"
```bash
# Change the port in backend/.env
PORT=5001
```

### "npm: command not found"
Node.js is not installed. [Install it here](https://nodejs.org/)

### "Files won't upload"
1. Check that backend is running on port 5000
2. Ensure `backend/uploads` directory exists
3. Check browser console for errors (F12)

### "Can't access admin dashboard"
1. Make sure backend is running
2. Enter correct password (default: `admin123`)
3. Clear browser cookies and try again

---

## Project Structure

```
3D-Print-Site/
├── backend/          ← Express.js server (port 5000)
├── frontend/         ← React client app (port 3000)
├── admin/            ← React admin panel (port 3001)
└── README.md         ← Full documentation
```

---

## Environment Files

### Backend Configuration

Create `backend/.env`:
```
PORT=5000
ADMIN_PASSWORD=admin123
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

---

## Next Steps

- [Read Full Documentation](./README.md)
- [Setup Production Deployment](./README.md#security-considerations)
- [Database Migration](./README.md#file-storage)

---

## Need Help?

- Check [Troubleshooting](./README.md#troubleshooting) section in README
- Review browser console (F12) for error messages
- Check terminal output for server errors

---

## Quick Feature List

✅ Upload files  
✅ Download files  
✅ Set prices for files  
✅ Admin dashboard  
✅ File management  
✅ JWT authentication  
✅ Responsive design  
✅ Tailwind CSS styling  

Enjoy! 🚀
