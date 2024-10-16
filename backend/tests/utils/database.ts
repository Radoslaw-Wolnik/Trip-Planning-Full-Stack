import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
let mongod: MongoMemoryServer | null = null;

export async function connectDatabase(): Promise<void> {
  let mongoUri: string;

  switch (process.env.TEST_DB) {
    case 'docker':
      try {
        await execPromise('docker-compose -f docker-compose.test.yml up -d');
        mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db';
        await waitForMongoDB(mongoUri);
        await execPromise('docker-compose -f docker-compose.test.yml up -d redis');
        console.log('Docker services started successfully');
      } catch (error) {
        console.error('Failed to start Docker services:', error);
        process.exit(1);
      }
      break;
    case 'local':
      mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db';
      break;
    default:
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
  }

  await mongoose.connect(mongoUri);
  console.log(`Connected to MongoDB at ${mongoUri}`);
}

export async function closeDatabaseConnection(): Promise<void> {
  await mongoose.connection.close();

  if (process.env.TEST_DB === 'docker') {
    try {
      await execPromise('docker-compose -f docker-compose.test.yml down');
      console.log('Docker services stopped');
    } catch (error) {
      console.error('Failed to stop Docker services:', error);
    }
  } else if (mongod) {
    await mongod.stop();
  }
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