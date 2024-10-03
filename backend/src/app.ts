import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import environment from './config/environment';
import { errorHandler } from './middleware/error.middleware';
import { addRequestId } from './middleware/request-id.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tripRoutes from './routes/trip.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: environment.app.frontend,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(addRequestId);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

// Error handling
app.use(errorHandler);

export default app;