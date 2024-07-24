import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import roadtripRoutes from './routes/roadtripRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/roadtrips', roadtripRoutes);

export default app;