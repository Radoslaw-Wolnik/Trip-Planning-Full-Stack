// src/routes/tripRoutes.js

import express from 'express';
import { 
    createTrip, 
    getTrips, 
    updateTrip, 
    shareTrip, 
    joinTrip, 
    generateShareLink, 
    getSharedTrip 
} from '../controllers/tripController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createTrip);
router.get('/', auth, getTrips);
// router.get('/:id', authenticateToken, getTrip);
router.put('/:id', auth, updateTrip);
router.post('/:id/share', auth, shareTrip);
router.post('/join', auth, joinTrip);

// router.delete('/:id', authenticateToken, deleteTrip);

router.post('/:id/share', authenticateToken, generateShareLink);
router.get('/shared/:shareCode', getSharedTrip);

export default router;