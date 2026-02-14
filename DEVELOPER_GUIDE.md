# Developer's Guide & Code Standards

Complete guide for developers working on the 3D Print Site project.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Code Standards](#code-standards)
3. [Development Workflow](#development-workflow)
4. [Testing Guidelines](#testing-guidelines)
5. [Git Workflow](#git-workflow)
6. [Common Tasks](#common-tasks)
7. [Performance Tips](#performance-tips)
8. [Security Notes](#security-notes)

---

## Getting Started

### Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd 3D-Print-Site

# Install dependencies
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin

# Setup environment
cp backend/.env.example backend/.env
```

### Start Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start

# Terminal 3 - Admin
cd admin && npm start
```

### Verify Setup
```bash
# Health check
curl http://localhost:5000/api/health

# Visit in browser
# Frontend: http://localhost:3000
# Admin: http://localhost:3001
```

---

## Code Standards

### JavaScript/Node.js Standards

#### Naming Conventions
```javascript
// Constants - UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 500 * 1024 * 1024;
const DEFAULT_PORT = 5000;

// Variables/Functions - camelCase
const uploadedFile = data.file;
function handleFileUpload() { }

// Classes - PascalCase
class FileManager { }

// Private methods - _leadingUnderscore
function _validateFile() { }
```

#### Async/Await Pattern
```javascript
// ✓ Preferred
async function uploadFile(req, res) {
  try {
    const file = await saveFile(req.file);
    res.json({ file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ✗ Avoid
function uploadFile(req, res) {
  saveFile(req.file)
    .then(file => res.json({ file }))
    .catch(error => res.status(500).json({ error: error.message }));
}
```

#### Error Handling
```javascript
// ✓ Good
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', error);
  throw new CustomError('Operation failed');
}

// ✗ Avoid
try {
  const result = await riskyOperation();
} catch (error) {
  // Silent failure
}
```

### React/JSX Standards

#### Component Structure
```javascript
// ✓ Preferred structure
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Props validation
function FileUpload({ onUpload }) {
  // Hooks at top
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Effects after hooks
  useEffect(() => {
    // Initialize
  }, []);

  // Event handlers
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Render
  return (
    <div>
      {/* JSX here */}
    </div>
  );
}

export default FileUpload;
```

#### Component Naming
```javascript
// ✓ Preferred - descriptive names
function UserUploadForm() { }
function AdminFileTable() { }
function DownloadButton() { }

// ✗ Avoid - vague names
function Form() { }
function Table() { }
function Button() { }
```

#### Conditional Rendering
```javascript
// ✓ Preferred
{loading && <Spinner />}
{files.length > 0 ? <FileList /> : <EmptyState />}

// ✗ Avoid
{loading ? <Spinner /> : null}
{files.length > 0 && <FileList />}  // if you need else
```

### Tailwind CSS Classes

#### Organization
```jsx
// ✓ Preferred - responsive first
<div className="w-full md:w-1/2 lg:w-1/3 px-4 py-2">
  {/* Content */}
</div>

// Organize: responsive → layout → spacing → colors → effects
<button className="
  w-full md:w-auto
  px-4 py-2
  bg-blue-600 hover:bg-blue-700
  text-white font-bold
  rounded-lg
  transition-colors
">
  Click Me
</button>
```

---

## Development Workflow

### Feature Development Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/file-compression
   ```

2. **Make Changes**
   - Write code following standards
   - Test locally
   - Commit frequently

3. **Run Tests**
   ```bash
   npm test
   npm run lint
   ```

4. **Create Pull Request**
   - Add description
   - Link issues
   - Request review

5. **Code Review**
   - Address comments
   - Update PR
   - Get approval

6. **Merge & Deploy**
   ```bash
   git merge --squash feature/file-compression
   git push origin main
   ```

### Local Development Tips

```bash
# Start with auto-reload
npm run dev:backend
npm run dev:frontend
npm run dev:admin

# Watch for changes
npm run watch

# Debug with Node Inspector
node --inspect-brk src/server.js

# Debug in browser
chrome://inspect
```

---

## Testing Guidelines

### Backend Testing

```javascript
// ✓ Test structure
describe('File Upload API', () => {
  it('should upload file successfully', async () => {
    // Arrange
    const mockFile = { name: 'test.stl', size: 1024 };
    
    // Act
    const response = await upload(mockFile);
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.file).toBeDefined();
  });

  it('should reject oversized files', async () => {
    // Arrange
    const largeFile = { size: 600 * 1024 * 1024 };
    
    // Act & Assert
    await expect(upload(largeFile)).rejects.toThrow();
  });
});
```

### Frontend Testing

```javascript
// ✓ Component test
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from './FileUpload';

describe('FileUpload Component', () => {
  it('renders upload button', () => {
    render(<FileUpload />);
    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<FileUpload />);
    const input = screen.getByType('file');
    fireEvent.change(input, { target: { files: [new File()] } });
    expect(input.files).toHaveLength(1);
  });
});
```

### Manual Testing Checklist

Before committing:
- [ ] No console errors
- [ ] No compilation warnings
- [ ] All UI elements render
- [ ] Responsive on mobile
- [ ] Forms validate
- [ ] Error messages display
- [ ] Loading states work
- [ ] File operations complete

---

## Git Workflow

### Commit Message Standards

```bash
# ✓ Preferred format
git commit -m "feat: add file compression support"
git commit -m "fix: resolve CORS error in admin login"
git commit -m "docs: update API documentation"
git commit -m "style: format backend routes"
git commit -m "test: add file upload tests"

# ✗ Avoid
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "Update"
```

### Commit Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build/dependency updates

### Branch Naming
```bash
feature/user-authentication
bugfix/cors-issue
hotfix/security-vulnerability
docs/api-documentation
```

---

## Common Tasks

### Add New API Endpoint

1. Create route handler:
```javascript
// backend/src/routes/userRoutes.js
import express from 'express';

const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
```

2. Add to server.js:
```javascript
import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);
```

3. Test with curl:
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John"}'
```

### Add New React Component

1. Create component file:
```javascript
// frontend/src/components/UserCard.jsx
import React from 'react';

function UserCard({ user }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}

export default UserCard;
```

2. Import and use:
```javascript
import UserCard from '../components/UserCard';

// In JSX
<UserCard user={userData} />
```

### Update Environment Variables

1. Edit `.env` file
2. Restart server
3. No rebuild needed for Node.js
4. For React (frontend/admin), rebuild may be needed

### Database Schema Changes

Current system uses JSON. To add new fields to file object:

```javascript
// In backend/src/config/database.js
const fileData = {
  id: Date.now().toString(),
  originalName: file.originalname,
  filename: file.filename,
  size: file.size,
  uploadDate: new Date(),
  price: null,
  downloadCount: 0,
  status: 'pending',
  // NEW FIELD:
  category: 'uncategorized'
};
```

---

## Performance Tips

### Backend Optimization

```javascript
// ✓ Use streams for large files
res.download(filePath);  // Uses streams automatically

// ✓ Enable compression
app.use(compression());

// ✓ Use async/await for parallel operations
const [users, files] = await Promise.all([
  getUsers(),
  getFiles()
]);

// ✗ Avoid
users = await getUsers();
files = await getFiles();  // Sequential - slower
```

### Frontend Optimization

```javascript
// ✓ Lazy load routes
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// ✓ Memoize expensive computations
const memoizedValue = useMemo(() => expensiveCalculation(a), [a]);

// ✓ Use useCallback for handlers
const handleClick = useCallback(() => {
  // Handler logic
}, []);

// ✗ Avoid inline functions in render
<button onClick={() => doSomething()} />  // Creates new function each render
```

### General Tips
- Minimize bundle size
- Enable gzip compression
- Use CDN for static assets
- Implement caching headers
- Optimize database queries
- Use indexes for frequently searched fields

---

## Security Notes

### Input Validation
```javascript
// ✓ Always validate user input
if (!email || !email.includes('@')) {
  throw new Error('Invalid email');
}

// Check file type
const allowedTypes = ['image/png', 'image/jpeg'];
if (!allowedTypes.includes(file.mimetype)) {
  throw new Error('Invalid file type');
}
```

### Authentication
```javascript
// ✓ Verify token on protected routes
router.get('/admin/files', verifyAdminToken, (req, res) => {
  // Safe to use req.admin
});

// ✗ Don't trust client
// Don't pass sensitive data in URLs
// Don't log passwords
```

### Error Messages
```javascript
// ✓ Generic error messages to users
res.status(500).json({ error: 'Operation failed' });

// ✗ Don't expose internal details
res.status(500).json({ error: error.stack });
```

---

## Quick Reference

### File Locations
- Backend routes: `backend/src/routes/`
- Frontend pages: `frontend/src/pages/`
- Admin pages: `admin/src/pages/`
- Styles: Tailwind CSS (inline classes)
- Config: `backend/.env`

### Important Files
- Server: `backend/src/server.js`
- Database: `backend/data.json`
- Frontend app: `frontend/src/App.jsx`
- Admin app: `admin/src/App.jsx`

### Port Mapping
- Backend API: `5000`
- Frontend: `3000`
- Admin: `3001`

---

## Resources & References

- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-dev-guide-index/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JavaScript ES6+](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## Team Communication

- **Code Review**: Be respectful and constructive
- **Issues**: Use GitHub Issues for bugs/features
- **Discussions**: Use PR comments for technical discussions
- **Meetings**: Schedule for async-first team
- **Documentation**: Keep updated with code changes

---

## Getting Help

1. Check existing documentation
2. Search previous issues
3. Ask in team chat
4. Create detailed issue with:
   - What you tried
   - What happened
   - Expected behavior
   - Error messages

---

**Last Updated**: February 14, 2026  
**Version**: 1.0.0  
Happy Coding! 🚀
