import { Server } from 'socket.io';
import http from 'http';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trip from '../models/Trip.js';
import connectDB from '../config/database.js';

dotenv.config();

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

const updateRealTimeStatus = async (tripId) => {
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

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});