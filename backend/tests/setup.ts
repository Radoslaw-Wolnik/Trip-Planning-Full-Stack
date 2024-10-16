import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './utils/database';

export default async function setup(): Promise<void> {
  // Load test environment variables
  dotenv.config({ path: path.resolve(__dirname, 'config', '.env.test') });

  // Connect to the database
  await connectDatabase();

  // Additional setup steps
  await setupTestData();
}

async function setupTestData(): Promise<void> {
  // Add any test data setup here
  // For example, creating test users, trips, etc.
}