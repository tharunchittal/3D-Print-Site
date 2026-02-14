import jwt from 'json-web-token';

export function verifyAdminToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    jwt.verify(process.env.JWT_SECRET || 'your_jwt_secret_key_here', token, (err, data) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.admin = data;
      next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Token verification failed' });
  }
}

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    jwt.verify(process.env.JWT_SECRET || 'your_jwt_secret_key_here', token, (err, data) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.user = data;
      next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Token verification failed' });
  }
}
