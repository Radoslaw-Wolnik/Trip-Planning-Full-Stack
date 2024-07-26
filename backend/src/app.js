import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';

dotenv.config();

const app = express();

// idk why but process.env.FRONTEND doesnt work but its not the most important thing
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);


export default app;