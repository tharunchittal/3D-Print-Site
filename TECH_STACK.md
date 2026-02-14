# Technology Stack & Architecture

## Frontend Stack (Client)

### Technologies
- **React 18.2** - UI library
- **React Router 6.16** - Client-side routing
- **Axios 1.6** - HTTP client
- **Tailwind CSS 3.3** - Styling framework
- **PostCSS** - CSS processing

### Components
- Home page with file upload
- Download page with file browsing
- Responsive design
- Real-time file status

### Features
- Drag-and-drop file upload
- File preview before upload
- Download progress tracking
- Responsive mobile UI
- Error handling and toast notifications

---

## Admin Dashboard Stack

### Technologies
- **React 18.2** - UI library
- **Axios 1.6** - HTTP client
- **Tailwind CSS 3.3** - Styling framework

### Features
- Secure admin login with password
- Dashboard with real-time statistics
- File management interface
- Inline price editing
- File approval/rejection workflow
- Download management from admin
- File deletion with confirmation
- Tab-based file filtering (all/pending/approved)

### Pages
- **Login Page** - Password-protected authentication
- **Dashboard** - Main management interface

---

## Backend API Stack

### Technologies
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.18** - Web framework
- **Multer 1.4** - File upload handling
- **JWT (json-web-token)** - Authentication
- **CORS** - Cross-origin requests
- **dotenv 16.3** - Environment configuration

### Architecture

```
Backend Structure:
├── server.js           # Express setup & middleware
├── routes/
│   ├── authRoutes.js   # Admin login endpoint
│   ├── fileRoutes.js   # Upload/download endpoints
│   └── adminRoutes.js  # File management endpoints
├── middleware/
│   └── auth.js         # JWT verification
├── config/
│   └── database.js     # JSON data storage
└── uploads/            # File storage directory
```

### API Routes

**Public Routes:**
- `POST /api/files/upload` - Upload file
- `GET /api/files` - Get approved files
- `GET /api/files/download/:id` - Download file

**Protected Routes (Admin):**
- `POST /api/auth/admin-login` - Admin authentication
- `GET /api/admin/files` - View all files
- `PUT /api/admin/files/:id/price` - Set file price
- `PUT /api/admin/files/:id/approve` - Approve file
- `DELETE /api/admin/files/:id` - Delete file
- `GET /api/admin/stats` - Get statistics

---

## Database

### Current Implementation
- **JSON File-based Storage** (`data.json`)
- Stores file metadata and admin info
- Simple, no external dependencies

### Data Model

```javascript
{
  "files": [
    {
      "id": "1697234567890",
      "originalName": "model.stl",
      "filename": "file-1697234567890-123456.stl",
      "size": 1024000,
      "uploadDate": "2024-02-14T10:30:45.123Z",
      "price": 9.99,
      "downloadCount": 5,
      "status": "approved" // or "pending"
    }
  ],
  "admins": []
}
```

### Future Database Options
- MongoDB
- PostgreSQL
- MySQL
- Firebase Firestore

---

## Authentication & Security

### Current Security
- **Password Protection**: Admin password in `.env`
- **JWT Tokens**: Bearer token authentication
- **CORS**: Configurable cross-origin access
- **File Upload Limits**: 500MB max file size
- **Multer Validation**: File extension checking

### Production Security Recommendations
- [ ] Implement role-based access control (RBAC)
- [ ] Add rate limiting
- [ ] Enable HTTPS/TLS
- [ ] Implement API key management
- [ ] Add audit logging
- [ ] Enable 2-factor authentication
- [ ] Use secrets management system
- [ ] Implement request validation
- [ ] Add CSRF protection
- [ ] Implement helmet.js for security headers

---

## Styling

### Tailwind CSS Configuration
- Custom color scheme (indigo/blue primary)
- Responsive utilities
- Dark mode support (admin dashboard)
- Smooth transitions and animations

### UI/UX Features
- Consistent color scheme across all apps
- Responsive grid layouts
- Loading states and spinners
- Error messages
- Success notifications
- Card-based design
- Table layouts for admin
- Form validation styling

---

## File Handling

### Upload Process
1. Client selects file via upload form
2. File sent to backend via multipart/form-data
3. Multer saves to `uploads/` directory
4. Metadata stored in `data.json`
5. File marked as "pending" approval

### Download Process
1. Client requests file from `/api/files/download/:id`
2. Backend verifies file exists
3. Download count incremented
4. File streamed to client
5. Browser prompts save dialog

### File Storage
- Physical location: `backend/uploads/`
- Metadata location: `backend/data.json`
- File naming: `fieldname-timestamp-random.ext`

---

## Performance Optimization

### Frontend
- React lazy loading
- Memoized components
- Event debouncing
- Optimized re-renders
- CSS minification with Tailwind

### Backend
- Efficient file streaming
- Connection pooling ready
- Async/await for non-blocking I/O
- CORS caching headers
- Compression-ready

### Deployment
- Docker containerization
- Multi-process management with PM2
- Nginx reverse proxy
- Browser caching headers
- Static asset serving

---

## Scalability

### Current Limitations
- Single server deployment
- JSON file storage limits
- No load balancing
- No caching layer

### Scaling Strategies

1. **Horizontal Scaling**
   - Multiple server instances
   - Load balancer (Nginx)
   - Shared file storage (S3, NFS)

2. **Database Migration**
   - Replace JSON with MongoDB
   - Enables better indexing
   - Supports clustering

3. **Caching Layer**
   - Redis for session caching
   - CDN for static assets
   - Browser caching optimization

4. **Async Processing**
   - Message queues (RabbitMQ)
   - Background jobs
   - Webhook support

---

## Development Workflow

### Local Setup
```bash
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin
```

### Development Mode
```bash
npm run dev
# Runs all three services concurrently
```

### Production Build
```bash
npm run build
# Builds optimized bundles
```

### Testing Structure
- Backend: Unit tests for routes
- Frontend: Component tests
- E2E: Integration tests (future)

---

## Environment Configuration

### Backend .env Variables
```
PORT=5000
ADMIN_PASSWORD=secure_password
NODE_ENV=production
JWT_SECRET=random_secret_key
MAX_FILE_SIZE=524288000
CORS_ORIGIN=*
```

### Optional Environment Variables
```
DATABASE_URL=mongodb://...
REDIS_URL=redis://...
S3_BUCKET=bucket-name
AWS_REGION=us-east-1
SMTP_HOST=smtp.gmail.com
```

---

## Deployment Architecture

### Traditional Server
```
┌─────────────┐
│   Client    │
│  (Port 80)  │
└──────┬──────┘
       │ HTTPS
       ▼
  ┌─────────────┐
  │    Nginx    │ Port 443 - Reverse Proxy
  │  Load Bal   │
  └──┬──┬───┬───┘
     │  │   │
     ▼  ▼   ▼
  ┌──┐┌──┐┌──┐
  │BE││FE││AD│ PM2 Managed
  │  ││  ││  │ Node Processes
  └──┘└──┘└──┘
     │
     ▼
  ┌─────────────┐
  │  uploads/   │
  │  data.json  │
  └─────────────┘
```

### Docker Deployment
```
┌──────────────────────┐
│  docker-compose up   │
└──────────────────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
 Backend Frontend Admin
 Container Container Container
    │    │    │
    └────┬────┘
         ▼
    Shared Network
```

---

## Monitoring & Logging

### PM2 Monitoring
- Real-time resource usage
- Process restarts
- Log aggregation
- Automated crash recovery

### Recommended Monitoring Stack
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Prometheus + Grafana
- DataDog
- New Relic

---

## Future Enhancements

- [ ] User authentication
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced search/filtering
- [ ] File versioning
- [ ] Scheduled imports/exports
- [ ] API rate limiting
- [ ] Advanced analytics
- [ ] Machine learning for recommendations
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Real-time collaboration

---

## Support & Documentation

- **README.md** - Project overview
- **QUICKSTART.md** - Getting started
- **API_DOCUMENTATION.md** - API reference
- **DEPLOYMENT.md** - Production setup
- **config.js** - Configuration examples

---

Last Updated: February 14, 2026
