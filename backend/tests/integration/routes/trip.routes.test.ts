import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/user.model';
import Trip from '../../src/models/trip.model';
import { connectDatabase, closeDatabaseConnection } from '../utils/database';
import { SocketService } from '../../src/services/socket.service';

jest.mock('../../src/services/socket.service');

describe('Trip Routes Integration Tests', () => {
  let authCookie: string;
  let userId: string;

  beforeAll(async () => {
    await connectDatabase();
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      isVerified: true,
    });
    userId = user._id.toString();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    authCookie = loginRes.headers['set-cookie'];
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  beforeEach(async () => {
    await Trip.deleteMany({});
    jest.clearAllMocks();
  });

  describe('POST /api/trips', () => {
    it('should create a new trip and add it to user trips', async () => {
      const res = await request(app)
        .post('/api/trips')
        .set('Cookie', authCookie)
        .send({
          title: 'Test Trip',
          description: 'A test trip',
          startDate: new Date(),
          endDate: new Date(),
          places: [{ name: 'Test Place', date: new Date(), latitude: 0, longitude: 0 }],
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Trip');
      expect(res.body.creator.toString()).toBe(userId);

      const user = await User.findById(userId);
      expect(user?.trips).toContainEqual(res.body._id);
    });
  });

  describe('GET /api/trips', () => {
    it('should get all trips for the user', async () => {
      await Trip.create([
        { title: 'Trip 1', creator: userId, invitationCode: 'code1', shareCode: 'share1' },
        { title: 'Trip 2', creator: userId, invitationCode: 'code2', shareCode: 'share2' },
      ]);

      const res = await request(app)
        .get('/api/trips')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe('Trip 1');
      expect(res.body[1].title).toBe('Trip 2');
    });
  });

  describe('PUT /api/trips/:id', () => {
    it('should update a trip and emit socket event', async () => {
      const trip = await Trip.create({
        title: 'Test Trip',
        creator: userId,
        invitationCode: 'code',
        shareCode: 'share',
      });

      const res = await request(app)
        .put(`/api/trips/${trip._id}`)
        .set('Cookie', authCookie)
        .send({
          title: 'Updated Trip Title',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Trip Title');

      expect(SocketService.getInstance().emitTripUpdate).toHaveBeenCalledWith(
        trip._id.toString(),
        expect.objectContaining({ title: 'Updated Trip Title' })
      );
    });
  });

  describe('DELETE /api/trips/:id', () => {
    it('should delete a trip, remove it from user trips, and emit socket event', async () => {
      const trip = await Trip.create({
        title: 'Test Trip',
        creator: userId,
        invitationCode: 'code',
        shareCode: 'share',
      });

      const user = await User.findById(userId);
      user!.trips.push(trip._id);
      await user!.save();

      const res = await request(app)
        .delete(`/api/trips/${trip._id}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Trip deleted successfully');

      const deletedTrip = await Trip.findById(trip._id);
      expect(deletedTrip).toBeNull();

      const updatedUser = await User.findById(userId);
      expect(updatedUser?.trips).not.toContainEqual(trip._id);

      expect(SocketService.getInstance().emitTripDeletion).toHaveBeenCalledWith(trip._id.toString());
    });
  });

  describe('POST /api/trips/:id/share', () => {
    it('should share a trip with another user', async () => {
      const trip = await Trip.create({
        title: 'Test Trip',
        creator: userId,
        invitationCode: 'code',
        shareCode: 'share',
      });

      const sharedUser = await User.create({
        username: 'shareduser',
        email: 'shared@example.com',
        password: 'password123',
        isVerified: true,
      });

      const res = await request(app)
        .post(`/api/trips/${trip._id}/share`)
        .set('Cookie', authCookie)
        .send({
          email: 'shared@example.com',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Trip shared successfully');

      const updatedTrip = await Trip.findById(trip._id);
      expect(updatedTrip?.sharedWith).toContainEqual(sharedUser._id);
    });
  });
});