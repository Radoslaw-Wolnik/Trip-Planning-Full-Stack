import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

export default app;