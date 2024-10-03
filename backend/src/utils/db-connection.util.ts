import mongoose from 'mongoose';
import enviorement from '../config/environment';

// Function to connect to MongoDB
const connectToMongoDB = async (): Promise<typeof mongoose> => {

  return mongoose.connect(enviorement.database.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
};

// function to handle retry logic
const connectDB = async (): Promise<void> => {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await connectToMongoDB();
      console.log('Connected to MongoDB');
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} - Error connecting to MongoDB:`, (error as Error).message);
      if (attempt < 5) {
        console.log('Retrying in 5 seconds...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        console.error('Failed to connect to MongoDB after multiple attempts');
        process.exit(1);
      }
    }
  }
};

// function for health check
export const checkDBHealth = (): string => {
  const dbStatus = mongoose.connection.readyState;
  switch (dbStatus) {
    case 0:
      return 'Disconnected';
    case 1:
      return 'Connected';
    case 2:
      return 'Connecting';
    case 3:
      return 'Disconnecting';
    default:
      return 'Unknown';
  }
};

export default connectDB;