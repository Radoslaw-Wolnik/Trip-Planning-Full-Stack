import express from 'express';
import { register, login, getUserProfile } from '../controllers/userController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// it first executes authenticateToken then getUserProfile so in auth we decode the token to id of user
router.get('/me', authenticateToken, getUserProfile);

export default router;
