import mongoose from 'mongoose';
import { exec } from 'child_process';
import util from 'util';
import { MongoMemoryServer } from 'mongodb-memory-server';

const execPromise = util.promisify(exec);

export default async function teardown(): Promise<void> {
  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');

  // Cleanup based on the test environment
  switch (process.env.TEST_DB) {
    case 'docker':
      try {
        // Stop all Docker services
        await execPromise('docker-compose -f docker-compose.test.yml down -v');
        console.log('Docker services stopped and volumes removed');
      } catch (error) {
        console.error('Failed to stop Docker services:', error);
      }
      break;
    case 'local':
      // No additional cleanup needed for local MongoDB
      break;
    default:
      // Stop MongoDB Memory Server
      const mongod = (global as any).__MONGOD__ as MongoMemoryServer;
      if (mongod) {
        await mongod.stop();
        console.log('MongoDB Memory Server stopped');
      }
  }

  // Additional cleanup steps
  await cleanupTestData();
}

async function cleanupTestData(): Promise<void> {
  // Add any test data cleanup here
  // For example, removing test users, trips, etc.
}