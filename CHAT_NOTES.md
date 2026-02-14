# 📝 Chat Notes & FAQ

**Save this file for quick reference!** This document contains important Q&A from development sessions.

---

## 🔐 JWT Secret Key Explained

### What is JWT_SECRET?
A **random secret key** that only your server knows. It's used to create and verify security tokens for admin authentication.

### How it Works
```
1. Admin logs in with password
2. Server creates a TOKEN using JWT_SECRET
3. Token is sent to admin's browser
4. When admin makes requests, browser sends token
5. Server verifies token using same JWT_SECRET
6. If valid → request allowed ✓
7. If invalid → request rejected ✗
```

### Analogy
Like a **signature** - only you know what it looks like, so you can verify if signatures are real.

### How to Generate One
```bash
# Option 1: Node.js (recommended)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Online generator
# https://www.uuidgenerator.net/

# Option 3: Your setup script
./setup-env.sh
```

### Good vs Bad Secret Keys

❌ **Bad (DON'T USE):**
- password123
- secret
- admin
- 12345
- Any dictionary word

✅ **Good (USE THESE):**
- a7f9c2e8k1m9p5q3r2t4u6v8x0z1...
- 32+ characters
- Mix of letters and numbers
- Completely random

### Where It Goes
```
File: backend/.env
Line: JWT_SECRET=your_random_secret_key_here
```

### Security Rules
1. **NEVER commit to Git** (it's in .gitignore)
2. **NEVER share** or post publicly
3. **NEVER use weak keys** (use random)
4. **ALWAYS keep private** like a password
5. **CHANGE it regularly** if needed

### How to Update It
```bash
# 1. Generate new key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Edit backend/.env
nano backend/.env

# 3. Replace old key with new one
# JWT_SECRET=new_key_here

# 4. Restart backend
pm2 restart 3d-backend
```

### What Happens When You Change It?
- **Old tokens**: Become invalid ❌
- **Admins**: Must login again
- **New tokens**: Use new secret key

---

## 🎛️ Raspberry Pi Deployment

### Quick Setup (30-45 minutes)

#### Prerequisites
- Raspberry Pi 4 (2GB+ RAM minimum, 4GB+ recommended)
- Raspbian OS
- 32GB+ microSD card
- Stable internet (wired Ethernet preferred)

#### 6-Step Setup
```bash
# 1. Update System
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js & Tools
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git pm2
sudo npm install -g pm2

# 3. Clone & Install (takes 10-15 min)
cd ~ && mkdir -p apps && cd apps
git clone <your-repo-url> 3d-print-site
cd 3d-print-site
export NODE_OPTIONS="--max-old-space-size=512"
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin

# 4. Build Frontend & Admin
npm --prefix frontend run build
npm --prefix admin run build

# 5. Configure Backend
cd backend
cp .env.example .env
nano .env
# Edit: ADMIN_PASSWORD, JWT_SECRET, MAX_FILE_SIZE=262144000

# 6. Start Services
pm2 start "npm --prefix backend start" --name "3d-backend" --max-memory-restart 256M
pm2 start "npm --prefix frontend start" --name "3d-frontend" --max-memory-restart 256M
pm2 start "npm --prefix admin start" --name "3d-admin" --max-memory-restart 256M
pm2 save
pm2 startup
```

#### File Size Limits for Pi
```
Recommended for Raspberry Pi:
MAX_FILE_SIZE=262144000  (250MB instead of 500MB)
```

#### Recommended Pi Settings (.env)
```
PORT=5000
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_random_secret_key
NODE_ENV=production
MAX_FILE_SIZE=262144000
```

#### Access Your Pi
```bash
# Get Pi's IP
hostname -I

# Access in browser
http://192.168.1.xxx  (frontend)
http://192.168.1.xxx/admin  (admin)
```

#### Performance Optimization
```bash
# Check system health
free -h          # Memory
df -h            # Disk
vcgencmd measure_temp  # Temperature
top              # CPU usage

# Monitor services
pm2 status
pm2 logs 3d-backend
pm2 monit
```

#### Common Pi Issues & Solutions

| Problem | Solution |
|---------|----------|
| Out of memory | `export NODE_OPTIONS="--max-old-space-size=1024"` |
| Build takes forever | Use Pi 4 with 4GB+, or `npm ci --production` |
| Services won't start | Check logs: `pm2 logs` |
| Can't access from network | Check IP: `hostname -I`, firewall: `sudo ufw allow 80` |
| Pi getting too hot | Add heatsink/fan, monitor: `vcgencmd measure_temp` |
| Slow uploads | Use Ethernet cable instead of WiFi |

#### Useful Pi Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart all
pm2 restart all

# Stop services
pm2 stop all

# Monitor
pm2 monit

# Backup data
tar -czf ~/backup-$(date +%Y%m%d).tar.gz \
  ~/apps/3d-print-site/backend/uploads \
  ~/apps/3d-print-site/backend/data.json
```

---

## 📚 Documentation Files Guide

| Document | Use For | Read Time |
|----------|---------|-----------|
| **RASPBERRY_PI.md** | Quick Pi setup | 20 min |
| **QUICKSTART.md** | Get running locally | 10 min |
| **README.md** | Complete overview | 20 min |
| **API_DOCUMENTATION.md** | API reference | 10 min |
| **DEPLOYMENT.md** | Production setup | 30 min |
| **TECH_STACK.md** | Architecture | 15 min |
| **DEVELOPER_GUIDE.md** | Code standards | 15 min |
| **VERIFICATION_CHECKLIST.md** | Testing | 20 min |

---

## 🔧 Quick Reference Commands

### Local Development
```bash
# Start all services
npm run dev

# Or individually:
cd backend && npm run dev
cd frontend && npm start
cd admin && npm start
```

### On Raspberry Pi
```bash
# Check services
pm2 status

# View logs
pm2 logs 3d-backend

# Restart all
pm2 restart all

# Monitor
pm2 monit

# SSH to Pi
ssh pi@<pi-ip>

# Get Pi's IP
hostname -I
```

### Generate Random Keys
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# UUID
node -e "console.log(require('crypto').randomUUID())"
```

### Configuration
```bash
# Edit backend config
nano backend/.env

# Edit frontend config
nano frontend/src/App.jsx

# Restart after changes
pm2 restart 3d-backend
```

---

## ⚠️ Important Security Notes

### Default Credentials to Change
```
Default Admin Password: admin123
Change in: backend/.env
Restart: pm2 restart 3d-backend
```

### Environment Variables (NEVER commit)
```
JWT_SECRET           → Keep secret
ADMIN_PASSWORD       → Keep secret
Database credentials → Keep secret
API keys             → Keep secret

But DO commit:
PORT, NODE_ENV, MAX_FILE_SIZE
```

### Git Strategy
```bash
# Check what's staging
git status

# Don't commit secrets
cat .gitignore  # Verify .env is ignored

# Commit safely
git add .
git commit -m "message"
git push
```

---

## 📊 Common Questions Answered

### Q: Do chat messages save?
**A:** No. Chat history is NOT saved when you exit. Save important info to files!

### Q: How do I save chat information?
**A:** 
1. Copy to a markdown file
2. Commit to Git
3. Or keep this file (CHAT_NOTES.md)

### Q: What if I forget something?
**A:** 
- Check documentation files
- Look at this CHAT_NOTES.md
- Review code comments
- Ask me again (I can re-explain)

### Q: What's the default setup on localhost?
**A:**
```
Frontend: http://localhost:3000
Admin: http://localhost:3001
Backend: http://localhost:5000
Default Password: admin123
```

### Q: Can I change the default password?
**A:** Yes!
```bash
# 1. Edit backend/.env
# 2. Change ADMIN_PASSWORD=newpassword
# 3. Restart: pm2 restart 3d-backend
```

### Q: What file size can I upload?
**A:** 
```
Default: 500MB
Raspberry Pi: 250MB (recommended)
Change in: backend/.env (MAX_FILE_SIZE)
```

### Q: Where are uploaded files stored?
**A:** `backend/uploads/` folder

### Q: What database does it use?
**A:** JSON files (can upgrade to MongoDB/PostgreSQL)

### Q: Can I use SSL/HTTPS?
**A:** Yes! See DEPLOYMENT.md for Let's Encrypt setup

### Q: How do I backup my data?
**A:**
```bash
tar -czf backup-$(date +%Y%m%d).tar.gz \
  backend/uploads backend/data.json
```

---

## 🎯 Project Structure Quick Reference

```
3D-Print-Site/
├── backend/               Node.js API
│   ├── .env              Configuration (KEEP SECRET)
│   ├── uploads/          Uploaded files
│   └── src/              Source code
├── frontend/             React client (port 3000)
├── admin/                React admin (port 3001)
└── docs/                 All documentation
```

---

## 🚀 Next Steps Checklist

- [ ] Generate and set JWT_SECRET in backend/.env
- [ ] Change admin password from default
- [ ] Test local setup works
- [ ] Deploy to Raspberry Pi (if needed)
- [ ] Setup backups
- [ ] Configure for production (if needed)
- [ ] Share with team

---

## 🔗 Useful Links in Your Project

- **Main documentation**: README.md
- **Quick start**: QUICKSTART.md
- **API reference**: API_DOCUMENTATION.md
- **Raspberry Pi setup**: RASPBERRY_PI.md
- **Deployment**: DEPLOYMENT.md
- **Architecture**: TECH_STACK.md
- **Developer guide**: DEVELOPER_GUIDE.md

---

## 📝 Session Notes

**Session Date**: February 14, 2026
**Topics Covered**:
1. ✅ Complete 3D Print Site built
2. ✅ Raspberry Pi deployment guide added
3. ✅ JWT Secret Key explained
4. ✅ This notes file created

**Files Created/Modified**:
- RASPBERRY_PI.md (new)
- DEPLOYMENT.md (updated with Pi section)
- CHAT_NOTES.md (this file)

---

## 💡 Remember

1. **Your project is complete** - All code is ready to run
2. **Everything is documented** - Check files before asking
3. **Chat doesn't save** - Save important info to files
4. **Git is your backup** - Commit frequently
5. **Security is important** - Keep .env files private

---

## 🆘 Troubleshooting Quick Links

**If something goes wrong:**
1. Check VERIFICATION_CHECKLIST.md
2. Check RASPBERRY_PI.md (Pi-specific issues)
3. Check DEPLOYMENT.md (Server issues)
4. Review code comments
5. Check error messages in logs

---

**Last Updated**: February 14, 2026  
**Status**: ✅ Project Ready  
**Author**: GitHub Copilot

---

*Keep this file handy for quick reference!* 📌
