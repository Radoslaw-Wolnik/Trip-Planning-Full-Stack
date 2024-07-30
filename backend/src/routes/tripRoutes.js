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
    deleteTrip,
    generateShareLink, 
    getSharedTrip,
    getTripDetails,
    joinTripEdit,
    leaveTripEdit
} from '../controllers/tripController.js';


const router = express.Router();

router.post('/', authenticateToken, createTrip);
router.get('/', authenticateToken, getTrips);

router.get('/:id', authenticateToken, getTripDetails);
router.put('/:id', authenticateToken, updateTrip);
router.delete('/:id', authenticateToken, deleteTrip);

router.post('/join', authenticateToken, joinTrip);

router.post('/:id/invite', authenticateToken, shareTrip);
router.post('/:id/share', authenticateToken, generateShareLink);

router.get('/shared/:shareCode', getSharedTrip);

// join leave the socket
router.post('/:id/join', authenticateToken, joinTripEdit);
router.post('/:id/leave', authenticateToken, leaveTripEdit);

export default router;