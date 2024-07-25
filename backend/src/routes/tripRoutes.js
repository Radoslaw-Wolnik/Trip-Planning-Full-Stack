// src/routes/roadtripRoutes.js

import express from 'express';
import Roadtrip from '../models/Trip.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

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