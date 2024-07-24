import mongoose from 'mongoose';
import User from './src/models/User.js'; // Adjust path as needed
import Roadtrip from './src/models/Roadtrip.js'; // Adjust path as needed
import env from './src/config/environment.js'; // Adjust path as needed

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const dbURI = `mongodb://${env.DB_HOST}/${env.DB_NAME}`;
    await mongoose.connect(dbURI, {
      user: env.DB_USER,
      pass: env.DB_PASS,
    });
    console.log('Connected to MongoDB');

    // Check if data already exists
    const usersExist = await User.countDocuments() > 0;
    if (usersExist) {
      console.log('Database already seeded');
      return;
    }

    // Seed data
    const user = await User.create({
      username: 'testuser',
      password: 'testpassword', // You might want to hash passwords in real apps
    });
    
    await Roadtrip.create({
      userId: user._id,
      name: 'Test Roadtrip',
      locations: ['Location1', 'Location2'],
    });

    console.log('Database seeded successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
