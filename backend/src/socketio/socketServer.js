import { Server } from 'socket.io';
import http from 'http';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trip from '../models/Trip.js';
import connectDB from '../config/database.js';

import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';


dotenv.config();

const redisClient = createClient({ url: process.env.REDIS_URL });

const pubClient = redisClient;
const subClient = pubClient.duplicate();

(async () => {
  try {
    // Connect both clients
    await Promise.all([pubClient.connect(), subClient.connect()]);

    // Setup the Redis adapter for Socket.IO
    io.adapter(createAdapter(pubClient, subClient));
    
    // Subscribe to 'tripUpdates' channel
    subClient.subscribe('tripUpdates', (message) => {
      const { tripId, updatedData } = JSON.parse(message);
      io.to(tripId).emit('trip-updated', updatedData);
    });

    console.log('Redis clients connected and subscribed to tripUpdates');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();


const PORT = process.env.SOCKET_PORT || 5001;

// Connect to MongoDB
connectDB();

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.adapter(createAdapter(pubClient, subClient));

export const updateRealTimeStatus = async (tripId) => {
  try {
    const trip = await Trip.findById(tripId);
    if (trip) {
      const enableRealTime = trip.activeEditors >= 2;
      io.to(tripId).emit('enable-real-time', enableRealTime);
      console.log(`Real-time ${enableRealTime ? 'enabled' : 'disabled'} for trip: ${tripId}`);
    }
  } catch (error) {
    console.error('Error updating real-time status:', error);
  }
};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-trip', (tripId) => {
    socket.join(tripId);
    console.log(`User joined trip: ${tripId}`);
  });

  socket.on('update-trip', async (data) => {
    socket.to(data.tripId).emit('trip-updated', data);
    console.log(`Trip updated: ${data.tripId}`);
  });

  socket.on('editor-joined', async (tripId) => {
    try {
      await Trip.findByIdAndUpdate(tripId, { $inc: { activeEditors: 1 } });
      await updateRealTimeStatus(tripId);
    } catch (error) {
      console.error('Error handling editor join:', error);
    }
  });

  socket.on('editor-left', async (tripId) => {
    try {
      await Trip.findByIdAndUpdate(tripId, { $inc: { activeEditors: -1 } });
      await updateRealTimeStatus(tripId);
    } catch (error) {
      console.error('Error handling editor leave:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//export const emitTripUpdate = (tripId, updatedData) => {
//  io.to(tripId).emit('trip-updated', updatedData);
//};

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});