// src/utils/server.util.ts
import mongoose from 'mongoose';
import logger from './logger.util';
import { Server } from 'http';

// Graceful shutdown handler
export const gracefulShutdown = async (server: Server, exitCode: number) => {
  try {
    logger.info('Closing HTTP server.');
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          logger.error('Error closing HTTP server:', err);
          return reject(err);
        }
        resolve(true);
      });
    });

    logger.info('Closing MongoDB connection.');
    await mongoose.connection.close();

    logger.info('Exiting process.');
    process.exit(exitCode);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

/*

export const gracefulShutdown = (server: Server) => {
  logger.info('Received kill signal, shutting down gracefully');
  server.close(() => {
    logger.info('Closed out remaining connections');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

*/