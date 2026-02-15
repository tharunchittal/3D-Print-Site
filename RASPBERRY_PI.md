# 🎛️ Raspberry Pi Quick Setup Guide

Running 3D Print Site on Raspberry Pi - Fast & Easy!

---

## ⏱️ Setup Time: 30-45 minutes

---

## 📋 Prerequisites

✅ Raspberry Pi 4 (2GB+ RAM, 4GB+ recommended)  
✅ Raspbian OS installed  
✅ Wired internet connection (WiFi is slower)  
✅ 32GB+ microSD card  
✅ SSH access to Pi (or monitor + keyboard)  

---

## 🚀 Quick Setup (Copy & Paste)

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js & Tools
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

### 3. Clone & Install
```bash
cd ~ && mkdir -p apps && cd apps
git clone <your-repo-url> 3d-print-site
cd 3d-print-site

# Set memory limit for Pi
export NODE_OPTIONS="--max-old-space-size=512"

# Install (takes 10-15 minutes)
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin

# Build frontend & admin
npm --prefix frontend run build
npm --prefix admin run build
```

### 4. Configure Backend
```bash
cd backend
cp .env.example .env
nano .env
```

**Edit these values:**
```
PORT=5000
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_random_secret_key
MAX_FILE_SIZE=262144000
```

Save: `Ctrl+O → Enter → Ctrl+X`

### 5. Start Services with PM2
```bash
cd ~/apps/3d-print-site

pm2 start "npm --prefix backend start" --name "3d-backend" --max-memory-restart 256M
pm2 start "npm --prefix frontend start" --name "3d-frontend" --max-memory-restart 256M
pm2 start "npm --prefix admin start" --name "3d-admin" --max-memory-restart 256M

pm2 save
pm2 startup
```

### 6. Setup Nginx
```bash
sudo nano /etc/nginx/sites-available/3d-print
```

**Paste this config:**
```nginx
upstream backend {
    server localhost:5000;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    client_max_body_size 250M;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 60s;
    }
}
```

Save: `Ctrl+O → Enter → Ctrl+X`

**Enable config:**
```bash
sudo ln -s /etc/nginx/sites-available/3d-print /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🌐 Access Your Pi

**Get Pi's IP address:**
```bash
hostname -I
```

Example output: `192.168.1.100`

**Access in browser:**
- Client: http://192.168.1.100
- Admin: http://192.168.1.100/admin

From another computer, replace IP with your Pi's IP.

---

## 📝 First Use Steps

1. **Upload a test file** from client (http://pi-ip)
2. **Go to admin** (http://pi-ip/admin)
3. **Login:** admin123 (or your password)
4. **Set a price** on the file
5. **Download it** from client page
6. **Success!** 🎉

---

## ⚡ Useful Commands

### Check if everything is running
```bash
pm2 status
```

### View logs
```bash
pm2 logs 3d-backend
pm2 logs 3d-frontend
```

### Restart all services
```bash
pm2 restart all
```

### Stop services (without removing)
```bash
pm2 stop all
```

### Monitor in real-time
```bash
pm2 monit
```

### Check system health
```bash
free -h          # Memory usage
df -h            # Disk usage
top              # CPU usage
vcgencmd measure_temp  # Pi temperature
```

---

## 🔧 Troubleshooting

### "Out of Memory" error
```bash
# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=1024"

# Restart services
pm2 restart all
```

### Services won't start
```bash
# Check if ports are in use
sudo lsof -i :5000
sudo lsof -i :3000

# Kill old process if needed
sudo kill -9 <process-id>
```

### Can't access from another computer
```bash
# Check Pi's IP
hostname -I

# Check Nginx is running
sudo systemctl status nginx

# Check firewall
sudo ufw status
sudo ufw allow 80
```

### Slow uploads
- Use wired Ethernet instead of WiFi
- Reduce MAX_FILE_SIZE in backend/.env
- Limit concurrent uploads

### Pi getting hot
```bash
# Monitor temperature
while true; do vcgencmd measure_temp; sleep 1; done

# Add heatsink/fan if temp > 70°C
# Reduce to Pi 3 mode if needed
```

---

## 🔄 Basic Operations

### Change Admin Password (anytime)
```bash
nano ~/apps/3d-print-site/backend/.env
# Change: ADMIN_PASSWORD=newpassword
pm2 restart 3d-backend
```

### Upload File Size Limit
```bash
nano ~/apps/3d-print-site/backend/.env
# Change: MAX_FILE_SIZE=262144000
pm2 restart 3d-backend
```

### View All Files
```bash
ls ~/apps/3d-print-site/backend/uploads/
```

### Backup Your Data
```bash
tar -czf ~/backup-$(date +%Y%m%d).tar.gz \
  ~/apps/3d-print-site/backend/uploads \
  ~/apps/3d-print-site/backend/data.json

# Copy to USB or cloud
```

---

## 🛡️ Security Tips

1. **Change admin password** immediately
2. **Use strong password** (mix upper, lower, numbers, symbols)
3. **Limit file size** to reasonable amount
4. **Regular backups** (daily or weekly)
5. **Monitor disk space** (don't let it fill up)
6. **Update system** regularly

```bash
# Update everything
sudo apt update && sudo apt upgrade -y
```

---

## 📊 Monitor Your Server

**Check system resources:**
```bash
# Install glances for dashboard
sudo apt install glances

# View dashboard
glances
```

**Check what's using space:**
```bash
du -sh ~/apps/3d-print-site/backend/uploads/
```

**Check what's using memory:**
```bash
ps aux --sort=-%mem | head
```

---

## 🚨 Emergency Commands

### If everything stops working
```bash
# Restart all services
pm2 restart all

# Check logs
pm2 logs

# Full restart
sudo reboot
```

### Delete data and start fresh
```bash
# WARNING: This deletes all files!
rm -rf ~/apps/3d-print-site/backend/uploads/*
rm ~/apps/3d-print-site/backend/data.json

# Restart
pm2 restart all
```

### Kill and restart manually
```bash
pm2 stop all
pm2 delete all
pm2 start "npm --prefix ~/apps/3d-print-site/backend start" --name "3d-backend"
```

---

## 📝 Auto-Backup Script

**Create backup script:**
```bash
nano ~/backup.sh
```

**Add this:**
```bash
#!/bin/bash
BACKUP_DIR="/media/usb/backups"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/3d-print-$(date +%Y%m%d_%H%M%S).tar.gz \
  ~/apps/3d-print-site/backend/uploads \
  ~/apps/3d-print-site/backend/data.json
echo "Backup done!"
```

**Make executable:**
```bash
chmod +x ~/backup.sh
```

**Run daily at 2 AM:**
```bash
crontab -e
# Add: 0 2 * * * /home/pi/backup.sh
```

---

## 🌍 Access from Internet

To access from outside your network:

1. **Port forward** on router (80 → Pi's IP:80)
2. Get public IP: http://whatismyipaddress.com
3. Access: http://your-public-ip

Or use:
- **Cloudflare Tunnel** (free, no port forward)
- **ngrok** (quick tunnel)
- **Dynamic DNS** (if IP changes)

---

## 📈 Performance Tips

- Use newer Raspberry Pi 4 (2GB minimum, 4GB+ better)
- Use wired Ethernet (WiFi is slower)
- Limit concurrent users
- Reduce file size limits
- Monitor disk space
- Keep Pi cool (heatsink/fan)

---

## 🎯 Next Steps

After basic setup works:

1. **HTTPS:** Setup SSL certificate (Let's Encrypt)
2. **Domain:** Point domain to Pi
3. **Backups:** Setup automatic backups
4. **Monitoring:** Setup monitoring alerts
5. **Upgrades:** Move to external SSD
6. **Scaling:** Add second Pi if needed

---

## 📚 Complete Guide

For more details, see:
- `DEPLOYMENT.md` - Full deployment guide
- `README.md` - Complete documentation
- `QUICKSTART.md` - Quick reference

---

## ✅ Success Checklist

- [ ] Node.js installed
- [ ] Dependencies installed
- [ ] Backend configured (.env file)
- [ ] Services running (pm2 status shows 3 online)
- [ ] Can access frontend
- [ ] Can access admin
- [ ] Can upload files
- [ ] Can download files
- [ ] Admin login works

**If all checked:** Your Pi is ready! 🎉

---

## 🆘 Quick Help

| Problem | Solution |
|---------|----------|
| Can't SSH | Enable SSH: `sudo raspi-config` → Interfacing → SSH |
| Out of disk | `df -h` check, delete old uploads |
| Out of memory | Upgrade Pi RAM or reduce services |
| Nginx not starting | `sudo nginx -t` check errors |
| Port 80 busy | `sudo lsof -i :80` find process, kill it |
| Services won't start | `pm2 logs` check error messages |
| Can't access from network | Check firewall, add port: `sudo ufw allow 80` |

---

**Happy hosting on Raspberry Pi! 🎛️**

Questions? See the full DEPLOYMENT.md guide or support docs.
