import express from 'express';
import { register, login, getUserProfile } from '../controllers/userController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticateToken, getUserProfile);

/*
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Server error');
  }
});*/

export default router;
