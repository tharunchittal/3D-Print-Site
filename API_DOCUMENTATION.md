# API Documentation

## Authentication

The admin endpoints require JWT bearer token authentication.

### Admin Login
```http
POST /api/auth/admin-login
Content-Type: application/json

{
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Usage:** Include token in Authorization header:
```
Authorization: Bearer <token>
```

---

## File Endpoints

### Upload File
```http
POST /api/files/upload
Content-Type: multipart/form-data

file: <binary file data>
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": "1697234567890",
    "originalName": "model.stl",
    "filename": "file-1697234567890-123456789.stl",
    "size": 1024000,
    "uploadDate": "2024-02-14T10:30:45.123Z",
    "price": null,
    "downloadCount": 0,
    "status": "pending"
  }
}
```

### Get Available Files
```http
GET /api/files
```

**Response:**
```json
[
  {
    "id": "1697234567890",
    "originalName": "model.stl",
    "filename": "file-1697234567890-123456789.stl",
    "size": 1024000,
    "uploadDate": "2024-02-14T10:30:45.123Z",
    "price": 9.99,
    "downloadCount": 5,
    "status": "approved"
  }
]
```

### Download File
```http
GET /api/files/download/:id
Authorization: (optional)
```

**Response:** File binary data (file download)

---

## Admin Endpoints

All admin endpoints require `Authorization: Bearer <token>` header.

### Get All Files
```http
GET /api/admin/files
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "1697234567890",
    "originalName": "model.stl",
    "filename": "file-...",
    "size": 1024000,
    "uploadDate": "2024-02-14T10:30:45.123Z",
    "price": null,
    "downloadCount": 0,
    "status": "pending"
  }
]
```

### Set File Price
```http
PUT /api/admin/files/:id/price
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 9.99
}
```

**Response:**
```json
{
  "message": "Price set successfully",
  "file": {
    "id": "1697234567890",
    "originalName": "model.stl",
    "price": 9.99,
    "status": "approved"
  }
}
```

### Approve File
```http
PUT /api/admin/files/:id/approve
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "File approved",
  "file": {
    "id": "1697234567890",
    "status": "approved"
  }
}
```

### Delete File
```http
DELETE /api/admin/files/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "File deleted successfully"
}
```

### Get Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalFiles": 15,
  "pendingFiles": 3,
  "approvedFiles": 12,
  "totalDownloads": 47,
  "totalSize": 52428800
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "File not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Common Use Cases

### Upload and Price a File
1. Upload file: `POST /api/files/upload`
2. Login: `POST /api/auth/admin-login`
3. Set price: `PUT /api/admin/files/:id/price`

### Download Procedure
1. Get files list: `GET /api/files`
2. User selects file
3. Download file: `GET /api/files/download/:id`

### Admin Workflow
1. Login: `POST /api/auth/admin-login`
2. View files: `GET /api/admin/files`
3. Set price: `PUT /api/admin/files/:id/price`
4. Monitor: `GET /api/admin/stats`

---

## Rate Limits

Currently no rate limiting implemented. 
Recommended for production: 100 requests/minute per IP

## Pagination

Not implemented. 
For large file collections, consider implementing pagination in future versions.
