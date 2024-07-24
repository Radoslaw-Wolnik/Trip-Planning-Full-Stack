// populateDB.js
import mongoose from 'mongoose';
import User from './src/models/User.js';
import Roadtrip from './src/models/Roadtrip.js';
import env from './src/config/environment.js';

const populateDB = async () => {
  try {
    const dbURI = `mongodb://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}/${env.DB_NAME}`;
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB to populate DB --------------------x-x--x-x-x-x-x-');

    const usersExist = await User.countDocuments() > 0;
    if (usersExist) {
      console.log('Database already populated');
      mongoose.disconnect();
      return;
    }

    const user = await User.create({
      username: 'testuser2',
      password: 'testpassword2',
    });
    console.log('User created:', user);

    await Roadtrip.create({
      userId: user._id,
      name: 'Test Roadtrip2',
      locations: ['Location1', 'Location2'],
    });
    console.log('Roadtrip created');

    console.log('Database populated successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error populating database:', error.message);
    process.exit(1);
  }
};

populateDB();
// to run:
// > docker-compose exec backend npm run populate