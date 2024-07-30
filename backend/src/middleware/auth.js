// src/middleware/auth.js

import jwt from 'jsonwebtoken';
import RevokedToken from '../models/RevokedToken.js';
import extractToken from '../utils/tokenExtractor.js';

const authenticateToken = async (req, res, next) => {
  const token = extractToken(req);
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Check if the token has been revoked
    const revokedToken = await RevokedToken.findOne({ token: token });
    if (revokedToken) {
      return res.status(403).json({ message: 'Token has been revoked.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded previously
    req.user =  { id: decoded.user.id }; // Ensure req.user has the correct user id;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export default authenticateToken;