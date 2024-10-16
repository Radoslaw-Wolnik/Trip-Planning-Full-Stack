import mongoose from 'mongoose';
import User from '../../../src/models/user.model';
import Trip from '../../../src/models/trip.model';
import RevokedToken from '../../../src/models/revoked-token.model';
import { connectDatabase, closeDatabaseConnection } from '../../utils/database';

describe('MongoDB Integration Tests', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Trip.deleteMany({});
    await RevokedToken.deleteMany({});
  });

  describe('User Model', () => {
    it('should create and retrieve a user', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();

      const retrievedUser = await User.findOne({ email: 'test@example.com' });
      expect(retrievedUser).not.toBeNull();
      expect(retrievedUser?.username).toBe('testuser');
    });

    it('should update a user', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();

      user.username = 'updateduser';
      await user.save();

      const updatedUser = await User.findOne({ email: 'test@example.com' });
      expect(updatedUser?.username).toBe('updateduser');
    });
  });

  describe('Trip Model', () => {
    it('should create and retrieve a trip', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();

      const trip = new Trip({
        title: 'Test Trip',
        creator: user._id,
        invitationCode: 'testcode',
        shareCode: 'testshare',
      });
      await trip.save();

      const retrievedTrip = await Trip.findOne({ title: 'Test Trip' }).populate('creator');
      expect(retrievedTrip).not.toBeNull();
      expect(retrievedTrip?.creator.username).toBe('testuser');
    });

    it('should update a trip', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      await user.save();

      const trip = new Trip({
        title: 'Test Trip',
        creator: user._id,
        invitationCode: 'testcode',
        shareCode: 'testshare',
      });
      await trip.save();

      trip.title = 'Updated Trip';
      await trip.save();

      const updatedTrip = await Trip.findOne({ _id: trip._id });
      expect(updatedTrip?.title).toBe('Updated Trip');
    });
  });

  describe('RevokedToken Model', () => {
    it('should create and retrieve a revoked token', async () => {
      const revokedToken = new RevokedToken({
        token: 'testtoken',
        expiresAt: new Date(),
      });
      await revokedToken.save();

      const retrievedToken = await RevokedToken.findOne({ token: 'testtoken' });
      expect(retrievedToken).not.toBeNull();
      expect(retrievedToken?.token).toBe('testtoken');
    });

    it('should delete expired tokens', async () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
      const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

      await RevokedToken.create([
        { token: 'expiredtoken1', expiresAt: pastDate },
        { token: 'expiredtoken2', expiresAt: pastDate },
        { token: 'validtoken', expiresAt: futureDate },
      ]);

      await RevokedToken.deleteMany({ expiresAt: { $lt: new Date() } });

      const remainingTokens = await RevokedToken.find({});
      expect(remainingTokens).toHaveLength(1);
      expect(remainingTokens[0].token).toBe('validtoken');
    });
  });
});