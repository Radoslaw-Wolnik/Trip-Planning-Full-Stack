import express from 'express';
import { 
    getUserProfile, 
    updateUserProfile, 
    deactivateAccount, 
    reactivateAccount,
    updateLastActiveTime
} from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/deactivate', deactivateAccount);
router.post('/reactivate/:token', reactivateAccount);
router.post('/update-last-active', updateLastActiveTime);

export default router;