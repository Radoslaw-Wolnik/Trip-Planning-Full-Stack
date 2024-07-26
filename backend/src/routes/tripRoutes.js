// src/routes/tripRoutes.js
import express from 'express';
import authenticateToken from '../middleware/auth.js';
// import auth from '../middleware/auth.js';
import { 
    createTrip, 
    getTrips, 
    updateTrip, 
    shareTrip, 
    joinTrip, 
    generateShareLink, 
    getSharedTrip 
} from '../controllers/tripController.js';


const router = express.Router();

router.post('/', authenticateToken, createTrip);
router.get('/', authenticateToken, getTrips);
// router.get('/:id', authenticateToken, getTrip);
router.put('/:id', authenticateToken, updateTrip);
router.post('/:id/share', authenticateToken, shareTrip);
router.post('/join', authenticateToken, joinTrip);
// router.delete('/:id', authenticateToken, deleteTrip);

router.post('/:id/share', authenticateToken, generateShareLink);
router.get('/shared/:shareCode', getSharedTrip);

export default router;