import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user.routes.js';
import tripRoutes from './routes/trip.routes.js';
import authRoutes from './routes/auth.routes.js';

import env from './config/environment.js'

const app = express();

// idk why but process.env.FRONTEND doesnt work but its not the most important thing
app.use(cors({
    origin: env.app.FRONTEND, //'http://localhost:5173',
    credentials: true,
  }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/auth', authRoutes);


export default app;