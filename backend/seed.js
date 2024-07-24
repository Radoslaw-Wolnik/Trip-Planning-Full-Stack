import mongoose from 'mongoose';
import User from './src/models/User.js'; // Adjust path as needed
import Roadtrip from './src/models/Roadtrip.js'; // Adjust path as needed
import env from './src/config/environment.js'; // Adjust path as needed

const seedDatabase = async () => {
  try {
    const dbURI = `mongodb://${env.DB_HOST}/${env.DB_NAME}`;
    await mongoose.connect(dbURI, {
      user: env.DB_USER,
      pass: env.DB_PASS,
    });
    console.log('Connected to MongoDB to populate DB --------------------x-x--x-x-x-x-x-');

    const usersExist = await User.countDocuments() > 0;
    if (usersExist) {
      console.log('Database already seeded');
      mongoose.disconnect();
      return;
    }

    const user = await User.create({
      username: 'testuser',
      password: 'testpassword',
    });
    console.log('User created:', user);

    await Roadtrip.create({
      userId: user._id,
      name: 'Test Roadtrip',
      locations: ['Location1', 'Location2'],
    });
    console.log('Roadtrip created');

    console.log('Database seeded successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
