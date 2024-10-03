import http from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import mongoose from 'mongoose';
import app from './app';
import environment from './config/environment';
import logger from './utils/logger.util';
import { SocketService } from './services/socket.service';
import { gracefulShutdown } from './utils/server.util';

const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect(environment.database.uri)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Initialize Socket.IO with Redis adapter
const io = new Server(server, {
  cors: {
    origin: environment.app.frontend,
    methods: ['GET', 'POST'],
  },
});

const pubClient = createClient({ url: environment.redis.url });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()])
  .then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    logger.info('Redis adapter set up for Socket.IO');
  })
  .catch((err) => logger.error('Redis connection error:', err));

// Initialize SocketService
SocketService.getInstance(server);

// Start the server
const PORT = environment.app.port;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => gracefulShutdown(server));
process.on('SIGINT', () => gracefulShutdown(server));

export default server;