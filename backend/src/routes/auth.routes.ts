import express from 'express';
import { 
    register, 
    login, 
    logout, 
    refreshToken, 
    verifyEmail, 
    requestPasswordReset,
    resetPassword,
    changePassword
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/refresh-token', refreshToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.put('/change-password', authenticateToken, changePassword);

export default router;