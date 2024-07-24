// src/routes/userRoutes.js

import express from 'express';
import { registerUser, loginUser, getUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Fetch all users
router.get('/', getUsers);

export default router;