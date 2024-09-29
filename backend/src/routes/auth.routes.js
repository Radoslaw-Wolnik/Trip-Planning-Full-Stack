import express from 'express';
import { register, login, logout, changePassword, sendVerificationEmail, verifyEmail, } from '../controllers/auth.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

router.use(authenticateToken);
router.post('/logout', logout);
router.put('/change-password', changePassword);
router.post('/send-verification', sendVerificationEmail);

export default router;