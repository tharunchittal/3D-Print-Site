import express from 'express';
import jwt from 'json-web-token';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Login route for admin
router.post('/admin-login', (req, res) => {
  const { password } = req.body;
  
  if (password === process.env.ADMIN_PASSWORD) {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    jwt.sign(secret, { role: 'admin', issuedAt: new Date() }, 
      { algorithm: 'HS256' }, (err, token) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to generate token' });
      }
      res.json({ token });
    });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

export default router;
