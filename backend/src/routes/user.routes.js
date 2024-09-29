import express from 'express';
import { register, login, logout, getUserProfile, uploadProfilePicture, changePassword, sendVerificationEmail, verifyEmail, getOtherUserProfile } from '../controllers/user.controller.js';
import { getUserTrips } from '../controllers/trip.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();



// it first executes authenticateToken then getUserProfile so in auth we decode the token to id of user
router.get('/me', authenticateToken, getUserProfile);

router.put('/upload-profile-picture', authenticateToken, upload.single('profilePicture'), uploadProfilePicture);


router.get('/:userId', authenticateToken, getOtherUserProfile);
router.get('/:userId/trips', authenticateToken, getUserTrips);


export default router;
