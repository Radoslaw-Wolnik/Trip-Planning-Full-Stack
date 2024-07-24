// src/config/database.js
import mongoose from 'mongoose';
import env from './environment.js';

const connectDB = async () => {
  try {
    const dbURI = `mongodb://${env.DB_HOST}/${env.DB_NAME}`;
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: env.DB_USER,
      pass: env.DB_PASS,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;