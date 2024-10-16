import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/user.model';
import Trip from '../../src/models/trip.model';
import { connectDatabase, closeDatabaseConnection } from '../utils/database';

describe('Trip E2E Tests', () => {
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
  });

  describe('POST /api/trips', () => {
    it('should create a new trip', async () => {
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
    });
  });

  describe('GET /api/trips', () => {
    it('should get all trips for the user', async () => {
      await Trip.create({
        title: 'Test Trip 1',
        creator: userId,
        invitationCode: 'code1',
        shareCode: 'share1',
      });
      await Trip.create({
        title: 'Test Trip 2',
        creator: userId,
        invitationCode: 'code2',
        shareCode: 'share2',
      });

      const res = await request(app)
        .get('/api/trips')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe('Test Trip 1');
      expect(res.body[1].title).toBe('Test Trip 2');
    });
  });

  describe('PUT /api/trips/:id', () => {
    it('should update a trip', async () => {
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
    });
  });

  describe('DELETE /api/trips/:id', () => {
    it('should delete a trip', async () => {
      const trip = await Trip.create({
        title: 'Test Trip',
        creator: userId,
        invitationCode: 'code',
        shareCode: 'share',
      });

      const res = await request(app)
        .delete(`/api/trips/${trip._id}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Trip deleted successfully');

      const deletedTrip = await Trip.findById(trip._id);
      expect(deletedTrip).toBeNull();
    });
  });
});