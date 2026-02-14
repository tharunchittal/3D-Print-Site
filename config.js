// Configuration for the entire 3D Print Site
module.exports = {
  backend: {
    port: 5000,
    apiUrl: 'http://localhost:5000',
    uploadDir: './uploads',
    maxFileSize: 500 * 1024 * 1024, // 500MB
  },
  frontend: {
    port: 3000,
    apiUrl: 'http://localhost:5000',
  },
  admin: {
    port: 3001,
    apiUrl: 'http://localhost:5000',
  },
  security: {
    jwtSecret: 'your_jwt_secret_key_here',
    adminPassword: 'admin123',
  },
  database: {
    type: 'json', // Can be changed to 'mongodb'
    dataFile: './data.json',
  },
};
