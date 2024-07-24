import mongoose from 'mongoose';
import env from './environment.js';

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  const dbURI = `mongodb://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}/${env.DB_NAME}`;
  
  return mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Function to handle the retry logic
const connectDB = async () => {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await connectToMongoDB();
      console.log('Connected to MongoDB');
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} - Error connecting to MongoDB:`, error.message);
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

export default connectDB;
