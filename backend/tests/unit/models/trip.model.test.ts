import mongoose from 'mongoose';
import Trip, { ITrip } from '../../../src/models/trip.model';
import User from '../../../src/models/user.model';

describe('Trip Model', () => {
  let userId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    userId = user._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Trip.deleteMany({});
  });

  it('should create a new trip successfully', async () => {
    const tripData = {
      title: 'Test Trip',
      description: 'A test trip',
      startDate: new Date(),
      endDate: new Date(),
      places: [{ name: 'Test Place', date: new Date(), latitude: 0, longitude: 0 }],
      creator: userId,
      invitationCode: 'testcode',
      shareCode: 'testshare',
    };

    const trip = new Trip(tripData);
    await trip.save();

    expect(trip._id).toBeDefined();
    expect(trip.title).toBe(tripData.title);
    expect(trip.creator.toString()).toBe(userId);
    expect(trip.places).toHaveLength(1);
  });

  it('should require title and creator', async () => {
    const trip = new Trip({});
    let error;

    try {
      await trip.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.title).toBeDefined();
    expect(error.errors.creator).toBeDefined();
  });

  it('should update trip fields correctly', async () => {
    const trip = new Trip({
      title: 'Test Trip',
      creator: userId,
      invitationCode: 'testcode',
      shareCode: 'testshare',
    });
    await trip.save();

    trip.title = 'Updated Trip';
    trip.description = 'Updated description';
    await trip.save();

    const updatedTrip = await Trip.findById(trip._id);
    expect(updatedTrip?.title).toBe('Updated Trip');
    expect(updatedTrip?.description).toBe('Updated description');
  });

  it('should delete trip correctly', async () => {
    const trip = new Trip({
      title: 'Test Trip',
      creator: userId,
      invitationCode: 'testcode',
      shareCode: 'testshare',
    });
    await trip.save();

    await Trip.deleteOne({ _id: trip._id });

    const deletedTrip = await Trip.findById(trip._id);
    expect(deletedTrip).toBeNull();
  });

  it('should add and remove places correctly', async () => {
    const trip = new Trip({
      title: 'Test Trip',
      creator: userId,
      invitationCode: 'testcode',
      shareCode: 'testshare',
    });
    await trip.save();

    trip.places.push({ name: 'New Place', date: new Date(), latitude: 0, longitude: 0 });
    await trip.save();

    let updatedTrip = await Trip.findById(trip._id);
    expect(updatedTrip?.places).toHaveLength(1);

    updatedTrip!.places = [];
    await updatedTrip!.save();

    updatedTrip = await Trip.findById(trip._id);
    expect(updatedTrip?.places).toHaveLength(0);
  });

  it('should handle shared users correctly', async () => {
    const trip = new Trip({
      title: 'Test Trip',
      creator: userId,
      invitationCode: 'testcode',
      shareCode: 'testshare',
    });
    await trip.save();

    const sharedUser = await User.create({
      username: 'shareduser',
      email: 'shared@example.com',
      password: 'password123',
    });

    trip.sharedWith.push(sharedUser._id);
    await trip.save();

    const updatedTrip = await Trip.findById(trip._id);
    expect(updatedTrip?.sharedWith).toHaveLength(1);
    expect(updatedTrip?.sharedWith[0].toString()).toBe(sharedUser._id.toString());
  });
});