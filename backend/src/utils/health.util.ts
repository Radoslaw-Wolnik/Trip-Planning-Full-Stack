import mongoose from 'mongoose';
import { checkDBHealth } from './db-connection.util'; // Import the DB health helper
import logger from './logger.util'; // Assuming you have a logger utility
import environment from '../config/environment';

// Utility function to check the overall health (e.g., for use in other parts of the app)
export const checkOverallHealth = async (): Promise<boolean> => {
  try {
    // Check if database connection is healthy using the helper
    if (checkDBHealth() !== 'Connected') {
      throw new Error('Database connection is not healthy');
    }

    // Verify email service
    await verifyEmailService();

    // Add more checks as needed for other services (e.g., Redis, external APIs)

    return true;
  } catch (error) {
    logger.error('Overall health check failed:', error);
    return false;
  }
};

export const verifyEmailService = async(): Promise<void> => {
  try {
    await environment.email.service.verifyConnection();
    logger.info('Email service connection verified');
  } catch (error) {
    logger.error('Failed to verify email service connection', { error });
    throw error; // Propagate the error to be caught by the overall health check
  }
};
