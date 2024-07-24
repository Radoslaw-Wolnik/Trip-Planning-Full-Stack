import mongoose from 'mongoose';
import User from './src/models/User.js';
import Roadtrip from './src/models/Roadtrip.js';
import connectDB from './src/config/database.js';
import env from './src/config/environment.js';

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Roadtrip.deleteMany();

    // Create sample users
    const user1 = await User.create({ username: 'user1', password: 'pass1' });
    const user2 = await User.create({ username: 'user2', password: 'pass2' });

    // Create sample roadtrips
    await Roadtrip.create({
      userId: user1._id,
      name: 'Roadtrip 1',
      locations: ['Location A', 'Location B']
    });

    await Roadtrip.create({
      userId: user2._id,
      name: 'Roadtrip 2',
      locations: ['Location C', 'Location D']
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
