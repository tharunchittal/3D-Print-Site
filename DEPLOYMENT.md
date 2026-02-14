# Deployment Guide

This guide covers deploying the 3D Print Site to production environments.

## Prerequisites

- Server with Node.js v16+
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)
- PM2 or similar process manager
- Nginx or Apache for reverse proxy

## Deployment Options

### Option 1: Traditional Server Deployment

#### 1. Prepare Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

#### 2. Clone Repository
```bash
cd /home/user/apps
git clone <your-repo-url> 3d-print-site
cd 3d-print-site
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin
```

#### 3. Build Frontend and Admin
```bash
npm run build:frontend
npm run build:admin
```

#### 4. Configure Environment Variables

Create `backend/.env`:
```
PORT=5000
ADMIN_PASSWORD=your_strong_password
NODE_ENV=production
JWT_SECRET=your_random_secret_key
```

#### 5. Start Services with PM2

```bash
# Start backend
pm2 start "npm --prefix backend start" --name "3d-print-backend"

# Start frontend (serve static build)
pm2 start "npm --prefix frontend start" --name "3d-print-frontend"

# Start admin
pm2 start "npm --prefix admin start" --name "3d-print-admin"

# Save PM2 configuration
pm2 save

# Enable startup on reboot
pm2 startup
```

#### 6. Setup Nginx Reverse Proxy

Create `/etc/nginx/sites-available/3d-print`:

```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

upstream admin {
    server localhost:3001;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API backend
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Upload timeout
        client_max_body_size 500M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Admin dashboard
    location /admin/ {
        proxy_pass http://admin/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/3d-print /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Setup SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

---

### Option 2: Docker Deployment

#### 1. Prerequisites
- Docker and Docker Compose installed

#### 2. Build Images
```bash
cd /path/to/3d-print-site
docker-compose build
```

#### 3. Deploy
```bash
docker-compose up -d
```

#### 4. Check Status
```bash
docker-compose ps
docker-compose logs backend
```

#### 5. Nginx Configuration (same as above)

---

### Option 4: Raspberry Pi Deployment

Raspberry Pi is perfect for small-scale hosting! Here's how to set it up:

#### Prerequisites
- Raspberry Pi 4 (2GB+ RAM recommended, 4GB+ for optimal performance)
- Raspbian OS installed
- 32GB+ microSD card
- Stable internet connection
- SSH access (optional but recommended)

#### 1. Install Node.js on Raspberry Pi
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (ARM-compatible)
# For Raspberry Pi 4 (use Node 18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 2. Install Required Tools
```bash
# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Install Nginx (lightweight web server)
sudo apt install -y nginx
```

#### 3. Clone and Setup
```bash
# Create apps directory
mkdir -p ~/apps && cd ~/apps

# Clone repository
git clone <your-repo-url> 3d-print-site
cd 3d-print-site

# Install dependencies (this takes a while on Pi)
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin
```

#### 4. Build Frontend & Admin (Optimize for Pi)
```bash
# Build with memory limits for Raspberry Pi
export NODE_OPTIONS="--max-old-space-size=512"

# Build frontend
npm --prefix frontend run build

# Build admin
npm --prefix admin run build
```

#### 5. Setup Backend Environment
```bash
cp backend/.env.example backend/.env

# Edit configuration
nano backend/.env
```

**Recommended Pi settings:**
```ini
PORT=5000
ADMIN_PASSWORD=your_secure_password
NODE_ENV=production
JWT_SECRET=your_random_secret_key
MAX_FILE_SIZE=262144000
```

#### 6. Start Services with PM2
```bash
# Start backend
pm2 start "npm --prefix backend start" --name "3d-backend" --max-memory-restart 256M

# Start frontend (serve static build)
pm2 start "npm --prefix frontend start" --name "3d-frontend" --max-memory-restart 256M

# Start admin
pm2 start "npm --prefix admin start" --name "3d-admin" --max-memory-restart 256M

# Save PM2 configuration
pm2 save

# Setup auto-restart on boot
pm2 startup
```

#### 7. Setup Nginx on Raspberry Pi
```bash
# Enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create config file
sudo nano /etc/nginx/sites-available/3d-print
```

**Lightweight Nginx config for Pi:**
```nginx
upstream backend {
    server localhost:5000;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    client_max_body_size 256M;

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

**Enable the config:**
```bash
sudo ln -s /etc/nginx/sites-available/3d-print /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 8. Configure Firewall (Optional)
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22

# Allow HTTP
sudo ufw allow 80

# Allow HTTPS (for later)
sudo ufw allow 443

# Check status
sudo ufw status
```

---

### Raspberry Pi Performance Optimization

#### Memory Management
```bash
# Reduce swap usage
sudo nano /etc/dphys-swapfile
# Change: CONF_SWAPSIZE=100  (reduce from default)

# Restart swap
sudo /etc/init.d/dphys-swapfile stop
sudo /etc/init.d/dphys-swapfile start
```

#### Node.js Optimization for Pi
```bash
# Set memory limit for Node processes
export NODE_OPTIONS="--max-old-space-size=512 --max-http-header-size=16384"

# Add to ~/.bashrc for permanent effect
echo 'export NODE_OPTIONS="--max-old-space-size=512"' >> ~/.bashrc
source ~/.bashrc
```

#### Reduce File Size Limit
```bash
# Edit backend/.env to limit uploads
MAX_FILE_SIZE=262144000  # 250MB instead of 500MB
```

#### Monitor System Resources
```bash
# View real-time stats
top

# View disk usage
df -h

# View memory usage
free -h

# Monitor Pi temperature
vcgencmd measure_temp
```

---

### Raspberry Pi Troubleshooting

#### Out of Memory (OOM) Errors
**Problem:** `FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed`

**Solution:**
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=1024"

# Or reduce app count (run one per terminal instead of PM2)
```

#### Slow Build Process
**Problem:** Build takes 30+ minutes

**Solution:**
```bash
# Pre-built versions for Raspberry Pi
npm ci --production  # Uses package-lock.json

# Or cache npm packages
npm cache clean --force
npm ci --prefer-offline
```

#### CPU Throttling
**Problem:** Performance drops during upload

**Solution:**
```bash
# Check GPU memory allocation (can be reduced)
vcgencmd get_config int | grep gpu_mem

# Reduce GPU memory if needed
sudo nano /boot/config.txt
# Add: gpu_mem=64  (reduce from 128)

# Reboot
sudo reboot
```

#### Network Issues
**Problem:** Slow file transfers

**Solution:**
```bash
# Check network speed
iperf3 -c <server-ip>

# Switch to wired ethernet if using WiFi
# Or get a better WiFi adapter for Pi

# Check bandwidth usage
iftop
```

---

### Raspberry Pi Monitoring Dashboard

**Install system monitor:**
```bash
# Install htop for better monitoring
sudo apt install -y htop

# Install glances for dashboard
sudo apt install -y glances

# View Pi dashboard
glances
```

**Monitor PM2 processes:**
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs

# View process details
pm2 show 3d-backend
```

---

### Accessing Your Pi Server

From another computer on the network:

```bash
# Get Raspberry Pi IP
hostname -I

# Access web interface
# http://<pi-ip>  (frontend)
# http://<pi-ip>/admin  (admin)

# SSH into Pi
ssh pi@<pi-ip>

# Access files
scp -r pi@<pi-ip>:/home/pi/apps/3d-print-site/backend/uploads .
```

---

### Raspberry Pi Backup Strategy

**Backup your data regularly:**

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/media/usb-drive/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup uploads and data
tar -czf $BACKUP_DIR/3d-print-$DATE.tar.gz \
    ~/apps/3d-print-site/backend/uploads \
    ~/apps/3d-print-site/backend/data.json

echo "Backup completed: $BACKUP_DIR/3d-print-$DATE.tar.gz"
```

**Add to crontab (daily backup at 2 AM):**
```bash
crontab -e
# Add: 0 2 * * * /home/pi/backup.sh
```

---

### Raspberry Pi Maintenance Commands

```bash
# Check system health
lsb_release -a
uname -m
free -h
df -h
vcgencmd measure_clock arm
vcgencmd measure_temp

# View application logs
pm2 logs 3d-backend
pm2 logs 3d-frontend
pm2 logs 3d-admin

# Restart all services
pm2 restart all

# Stop services
pm2 stop all

# Clear PM2 logs
pm2 flush

# Update system (monthly)
sudo apt update && sudo apt upgrade -y
```

---

### Raspberry Pi Limitations & Solutions

| Limitation | Solution |
|-----------|----------|
| Low memory (1GB) | Use Pi 4 with 4GB+, limit Node memory |
| Slow CPU | Optimize code, reduce logging |
| Limited disk | Use external SSD via USB |
| No GPU | Don't rely on GPU acceleration |
| Overheating | Use heatsink/fan, monitor temp |
| Power loss | Use UPS, backup data |

---

### Scaling Beyond One Raspberry Pi

**Multiple Pis setup:**
```
┌─────────┐
│ Router  │
└────┬────┘
     │
  ┌──┴──┐
  │     │
┌─┴──┐ ┌┴──┐
│Pi 1│ │Pi 2│ ← Load balance with nginx
└─┬──┘ └┬──┘
  │     │
  └──┬──┘
   [NAS]  ← Shared storage
```

---

### Option 3: Docker on Cloud (AWS/Google Cloud/Azure)

#### AWS ECS Example:
```bash
# Login to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

# Tag and push images
docker tag 3d-print-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/3d-print-backend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/3d-print-backend:latest

# Create ECS Task Definition and Service
aws ecs create-service ...
```

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Enable CORS on specific domains only
- [ ] Implement rate limiting
- [ ] Keep Node.js updated
- [ ] Use environment variables for secrets
- [ ] Enable database encryption
- [ ] Setup regular backups
- [ ] Implement logging and monitoring
- [ ] Use strong database credentials
- [ ] Enable 2FA for admin (future enhancement)

## Backup Strategy

### Manual Backup
```bash
# Backup uploads and database
tar -czf 3d-print-backup-$(date +%Y%m%d).tar.gz \
    backend/uploads/ \
    backend/data.json

# Upload to cloud storage
aws s3 cp 3d-print-backup-*.tar.gz s3://your-bucket/backups/
```

### Automated Backup (Cron)
```bash
# Add to crontab
0 2 * * * cd /home/user/apps/3d-print-site && tar -czf /backups/3d-print-$(date +\%Y\%m\%d).tar.gz backend/uploads/ backend/data.json && aws s3 cp /backups/3d-print-$(date +\%Y\%m\%d).tar.gz s3://your-bucket/backups/
```

## Monitoring & Logging

### PM2 Monitoring
```bash
# Monitor in real-time
pm2 monit

# View logs
pm2 logs
pm2 logs 3d-print-backend
```

### Setup Logging
```bash
# Forward PM2 logs to file
pm2 install pm2-logrotate

# Save logs
pm2 save
```

## Scaling Considerations

For high traffic:

1. **Use Load Balancer**: Distribute traffic across multiple app instances
2. **Database**: Migrate to MongoDB/PostgreSQL for better scalability
3. **Cache**: Add Redis for caching
4. **CDN**: Use CDN for static assets
5. **Message Queue**: Add RabbitMQ for async operations
6. **Horizontal Scaling**: Run multiple instances of each service

---

## Troubleshooting Production Issues

### App Not Starting
```bash
pm2 logs 3d-print-backend
# Check .env file
# Check Node.js version
```

### High Memory Usage
```bash
pm2 show 3d-print-backend
# Enable clustering mode
pm2 start app.js -i max
```

### Database Issues
```bash
# Check data.json exists
ls -la backend/data.json

# Check permissions
chmod 755 backend/data.json
```

### Nginx 502 Bad Gateway
```bash
# Check backend is running
pm2 status
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Performance Optimization

1. **Enable Compression**:
```nginx
gzip on;
gzip_types text/plain text/css application/json;
```

2. **Browser Caching**:
```nginx
expires 7d;
add_header Cache-Control "public, immutable";
```

3. **Database Optimization**:
- Index frequently searched fields
- Archive old files
- Implement pagination

4. **Client-side**:
- Minify CSS/JS
- Lazy load images
- Use modern image formats

---

## Migration from Development to Production

1. Update all `.env` variables
2. Set `NODE_ENV=production`
3. Build optimized bundles
4. Test all features in staging first
5. Setup automated backups
6. Configure monitoring
7. Create deployment runbooks
8. Train team on management

---

## Support & Maintenance

- Regular security updates
- Monitor performance metrics
- Regular backups
- Update dependencies monthly
- Review logs weekly

For issues or questions, refer to the main README.md or contact support.
