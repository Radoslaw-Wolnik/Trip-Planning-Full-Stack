import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/user.model';
import { connectDatabase, closeDatabaseConnection } from '../utils/database';

describe('User Routes Integration Tests', () => {
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

  describe('GET /api/users/profile', () => {
    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('testuser');
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.password).toBeUndefined();
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Cookie', authCookie)
        .send({
          username: 'updateduser',
        });

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('updateduser');

      const updatedUser = await User.findById(userId);
      expect(updatedUser?.username).toBe('updateduser');
    });
  });

  describe('POST /api/users/update-last-active', () => {
    it('should update last active time', async () => {
      const res = await request(app)
        .post('/api/users/update-last-active')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Last active time updated successfully');

      const user = await User.findById(userId);
      expect(user?.lastTimeActive).toBeDefined();
    });
  });

  describe('POST /api/users/deactivate', () => {
    it('should deactivate user account', async () => {
      const res = await request(app)
        .post('/api/users/deactivate')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Account deactivated successfully');

      const user = await User.findById(userId);
      expect(user?.deactivated).toBeDefined();
      expect(user?.deactivationToken).toBeDefined();
      expect(user?.deactivationExpires).toBeDefined();
    });
  });

  describe('POST /api/users/reactivate/:token', () => {
    it('should reactivate user account', async () => {
      const user = await User.findById(userId);
      const token = user?.deactivationToken;

      const res = await request(app)
        .post(`/api/users/reactivate/${token}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Account reactivated successfully');

      const reactivatedUser = await User.findById(userId);
      expect(reactivatedUser?.deactivated).toBeUndefined();
      expect(reactivatedUser?.deactivationToken).toBeUndefined();
      expect(reactivatedUser?.deactivationExpires).toBeUndefined();
    });
  });
});