import express from 'express';
import { createTrip, getTrips, updateTrip, shareTrip } from '../controllers/tripController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createTrip);
router.get('/', auth, getTrips);
router.put('/:id', auth, updateTrip);
router.post('/:id/share', auth, shareTrip);

export default router;
