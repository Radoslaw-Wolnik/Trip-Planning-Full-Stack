import express from 'express';
import { 
    createTrip,
    getAllUserTrips,
    getTrip,
    updateTrip,
    deleteTrip,
    shareTrip,
    joinTrip,
    leaveTrip,
    updatePlace,
    addPlace,
    removePlace,
    updateRealTimeStatus,
    getTripByShareCode,
    regenerateShareCode
} from '../controllers/trip.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createTrip);
router.get('/', getAllUserTrips);
router.get('/:id', getTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/share', shareTrip);
router.post('/join', joinTrip);
router.post('/:id/leave', leaveTrip);
router.put('/:tripId/places/:placeId', updatePlace);
router.post('/:tripId/places', addPlace);
router.delete('/:tripId/places/:placeId', removePlace);
router.post('/real-time-status', updateRealTimeStatus);
router.get('/share/:shareCode', getTripByShareCode);
router.post('/:id/regenerate-share-code', regenerateShareCode);

export default router;