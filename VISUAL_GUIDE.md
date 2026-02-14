# 🎯 VISUAL QUICK GUIDE

## Your 3D Print Site Setup in 3 Simple Steps

---

## 📋 STEP 1: Install Dependencies (2 minutes)

```
Open Terminal/Command Prompt in the project folder
Then run these commands:
```

```bash
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin
```

**What it does:** Downloads all required libraries for each app

---

## 🚀 STEP 2: Start All Services (30 seconds)

**Open 3 Separate Terminal Windows**

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ You should see: `Server running on http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
✅ Browser opens automatically to: http://localhost:3000

### Terminal 3 - Admin
```bash
cd admin
npm start
```
✅ Browser opens automatically to: http://localhost:3001

---

## 🎨 STEP 3: Use Your App!

### Client Application (http://localhost:3000)
```
1. Click the upload box or drag a file
2. Select any file from your computer
3. Click "Upload File"
4. Go to "Download Files" to see it
```

### Admin Dashboard (http://localhost:3001)
```
1. Password field appears
2. Enter: admin123
3. Click "Sign In"
4. See your uploaded files
5. Click "Set Price" on any file
6. Enter a price (e.g., 9.99)
7. Click "Save"
8. File appears on download page!
```

---

## 📊 What This App Does

### For Clients
🔼 Upload files  
💰 See prices  
📥 Download files  

### For you (Admin)
📋 Approve files  
💵 Set prices  
📊 See statistics  
🗑️ Remove files  

---

## 🌐 Three Websites Running

| Website | URL | Purpose |
|---------|-----|---------|
| **Client** | http://localhost:3000 | Upload & download files |
| **Admin** | http://localhost:3001 | Manage files & set prices |
| **API** | http://localhost:5000 | Backend (for developers) |

---

## 🔑 Important Details

### Admin Password
```
Default: admin123
Change in: backend/.env
Restart backend to apply changes
```

### Uploaded Files Location
```
They go to: backend/uploads/
Metadata stored in: backend/data.json
```

### File Limits
```
Maximum file size: 500MB
Maximum upload time: 30 seconds
```

---

## ⚡ Quick Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open browser console | `F12` |
| Clear browser cache | `Ctrl+Shift+Delete` |
| Stop server | `Ctrl+C` |
| Find file | `Ctrl+F` |

---

## 🐛 Something Wrong?

### Frontend won't load
```
✓ Check Terminal 2 for errors
✓ Clear browser cache (Ctrl+Shift+Delete)
✓ Restart: npm start
```

### Upload fails
```
✓ Make sure backend is running (Terminal 1)
✓ Check: backend/uploads/ folder exists
✓ Try smaller file (< 100MB)
```

### Admin won't login
```
✓ Check password is: admin123
✓ Check: backend/.env file
✓ Restart backend (Terminal 1)
```

### Port 5000 in use
```
✓ Edit backend/.env
✓ Change PORT=5001
✓ Restart backend
```

---

## 📚 Need More Help?

| What You Need | Read This |
|---------------|-----------|
| Quick start | QUICKSTART.md |
| Complete guide | README.md |
| API details | API_DOCUMENTATION.md |
| Production setup | DEPLOYMENT.md |
| Code standards | DEVELOPER_GUIDE.md |
| Navigation | INDEX.md |

---

## ✅ Success Checklist

- [ ] All 3 terminals running without errors
- [ ] Frontend loads at localhost:3000
- [ ] Admin loads at localhost:3001
- [ ] Can upload a file
- [ ] Can login to admin
- [ ] Can set price on file
- [ ] Can download file
- [ ] Download counter increases

**If all checked:** You're good to go! 🎉

---

## 💾 Saving Your Work

**Important:** Uploaded files are stored locally
```
backend/uploads/     ← Your files
backend/data.json    ← File information
```

**To keep your files:**
- Backup backend/uploads/ folder
- Backup backend/data.json file

---

## 🔄 Restart Everything

If something goes wrong:

**Kill all services:** Press `Ctrl+C` in each terminal

**Clean start:**
```bash
# Delete old data if needed
rm backend/data.json

# Restart everything
npm run dev
```

---

## 🎨 Customization Ideas

1. **Change Admin Password**
   - Edit: `backend/.env`
   - Change: `ADMIN_PASSWORD=newpassword`
   - Restart backend

2. **Change Colors**
   - Edit: `frontend/src/index.css`
   - Add custom Tailwind colors
   - Rebuild frontend

3. **Change Welcome Text**
   - Edit: `frontend/src/pages/Home.jsx`
   - Look for `<h2>Upload Your File</h2>`
   - Change text

4. **Change File Limit**
   - Edit: `backend/.env`
   - Update `MAX_FILE_SIZE` value
   - Restart backend

---

## 🚀 When You're Ready for Production

1. Read: [DEPLOYMENT.md](DEPLOYMENT.md)
2. Change admin password
3. Generate strong JWT secret
4. Setup SSL certificate
5. Deploy to server
6. Setup backups

---

## 📞 FAQ

**Q: Can I upload really big files?**  
A: Max 500MB, but you can change this in backend/.env

**Q: What if I forget the admin password?**  
A: Change it in backend/.env and restart backend

**Q: Where are my files stored?**  
A: In backend/uploads/ folder on your computer

**Q: Can I use this in production?**  
A: Yes! See DEPLOYMENT.md for how to setup securely

**Q: Can multiple people use it?**  
A: Yes, they can access it at http://yourserver.com

---

## 🎯 Typical Workflow

1. **Admin uploads** (optional)
   - They can upload too

2. **Client uploads file**
   - File appears as "pending" in admin

3. **Admin reviews & prices**
   - Click "Set Price"
   - File becomes "approved"

4. **Client downloads**
   - File appears on download page
   - Client sees price
   - Download link appears

5. **Repeat**
   - More clients upload
   - Admin manages files

---

## 📊 Monitoring

### Check Backend Status
```bash
curl http://localhost:5000/api/health
```

Should return:  
`{"status":"Server is running"}`

### View Files
```bash
cat backend/data.json
```

Shows all file information

### View Uploaded Files
```bash
ls -la backend/uploads/
```

Shows all stored files

---

## 🎉 You're All Set!

1. ✅ Installed
2. ✅ Running
3. ✅ Ready to use!

**Open http://localhost:3000 and start uploading!** 

---

## 🆘 Emergency Reset

If everything breaks:

```bash
# Stop all terminals: Ctrl+C

# Delete data
rm backend/data.json

# Reinstall
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin

# Start fresh
npm run dev
```

---

## 📈 Next Level

After you're comfortable:
1. Customize the design
2. Add more features
3. Setup user accounts
4. Add payment system
5. Deploy to cloud
6. Setup database

See: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)

---

**Remember:** The full documentation has all the answers!

**Still stuck?** Read [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)

---

**Version:** 1.0.0  
**Status:** ✅ Ready to Use  
**Last Updated:** February 14, 2026

**Happy File Uploading! 🚀**
