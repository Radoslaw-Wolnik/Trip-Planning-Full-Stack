import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { exec } from 'child_process';
import util from 'util';
import dotenv from 'dotenv';
import path from 'path';

const execPromise = util.promisify(exec);
let mongod: MongoMemoryServer | null = null;

export default async function setup(): Promise<void> {
  // Load test environment variables
  dotenv.config({ path: path.resolve(__dirname, 'config', '.env.test') });

  let mongoUri: string;

  switch (process.env.TEST_DB) {
    case 'docker':
      // Start Docker MongoDB and other services
      try {
        await execPromise('docker-compose -f docker-compose.test.yml up -d');
        mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db';
        
        // Wait for MongoDB to be ready
        await waitForMongoDB(mongoUri);

        // Start other services if needed (e.g., Redis)
        await execPromise('docker-compose -f docker-compose.test.yml up -d redis');

        console.log('Docker services started successfully');
      } catch (error) {
        console.error('Failed to start Docker services:', error);
        process.exit(1);
      }
      break;
    case 'local':
      // Use local MongoDB instance
      mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db';
      break;
    default:
      // Use MongoDB Memory Server
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
  }

  process.env.MONGODB_URI = mongoUri;

  // Connect to the database
  await mongoose.connect(mongoUri);
  console.log(`Connected to MongoDB at ${mongoUri}`);

  // Additional setup steps
  await setupTestData();
}

async function waitForMongoDB(uri: string, maxAttempts = 30, interval = 1000): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(uri);
      await mongoose.connection.close();
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error('MongoDB connection failed after maximum attempts');
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}

async function setupTestData(): Promise<void> {
  // Add any test data setup here
  // For example, creating test users, trips, etc.
}