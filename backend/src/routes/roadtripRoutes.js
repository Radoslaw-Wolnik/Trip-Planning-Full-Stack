import express from 'express';
import jwt from 'jsonwebtoken';
import { Roadtrip } from '../index.js';

const router = express.Router();

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Add a new roadtrip
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, locations } = req.body;
    const newRoadtrip = new Roadtrip({ userId: req.user.userId, name, locations });
    await newRoadtrip.save();
    res.status(201).json(newRoadtrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all roadtrips for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const roadtrips = await Roadtrip.find({ userId: req.user.userId });
    res.json(roadtrips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
