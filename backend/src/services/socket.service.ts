import { Server } from 'socket.io';
import http from 'http';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import Trip from '../models/trip.model';
import environment from '../config/environment';
import logger from '../utils/logger.util';

export class SocketService {
  private static instance: SocketService;
  public io: Server;
  private pubClient: ReturnType<typeof createClient>;
  private subClient: ReturnType<typeof createClient>;

  private constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: environment.app.frontend,
        methods: ['GET', 'POST'],
      },
    });

    this.pubClient = createClient({ url: environment.redis.url });
    this.subClient = this.pubClient.duplicate();

    this.initializeRedis();
    this.initializeSocketEvents();
  }

  public static getInstance(server?: http.Server): SocketService {
    if (!SocketService.instance && server) {
      SocketService.instance = new SocketService(server);
    }
    return SocketService.instance;
  }

  private async initializeRedis() {
    try {
      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
      this.io.adapter(createAdapter(this.pubClient, this.subClient));

      this.subClient.subscribe('tripUpdates', (message) => {
        const { tripId, updatedData } = JSON.parse(message);
        this.io.to(tripId).emit('trip-updated', updatedData);
      });

      logger.info('Redis clients connected and subscribed to tripUpdates');
    } catch (err) {
      logger.error('Failed to connect to Redis:', err);
    }
  }

  private initializeSocketEvents() {
    this.io.on('connection', (socket) => {
      logger.info('A user connected');

      socket.on('join-trip', (tripId) => {
        socket.join(tripId);
        logger.info(`User joined trip: ${tripId}`);
      });

      socket.on('leave-trip', (tripId) => {
        socket.leave(tripId);
        logger.info(`User left trip: ${tripId}`);
      });

      socket.on('disconnect', () => {
        logger.info('User disconnected');
      });
    });
  }

  public emitTripUpdate(tripId: string, updatedData: any) {
    this.io.to(tripId).emit('trip-updated', updatedData);
  }

  public emitTripDeletion(tripId: string) {
    this.io.to(tripId).emit('trip-deleted', tripId);
  }

  public emitRealTimeStatus(tripId: string, enableRealTime: boolean) {
    this.io.to(tripId).emit('real-time-status', enableRealTime);
  }
}