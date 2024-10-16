import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/user.model';
import { connectDatabase, closeDatabaseConnection } from '../utils/database';
import { sendEmail } from '../../src/services/email.service';

jest.mock('../../src/services/email.service');

describe('Auth Routes Integration Tests', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and send verification email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered. Please check your email to verify your account.');

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).not.toBeNull();
      expect(user?.isVerified).toBe(false);
      expect(user?.verificationToken).toBeDefined();

      expect(sendEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Verify your email',
        text: expect.stringContaining('verify-email'),
      });
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        isVerified: true,
      });
    });

    it('should login a user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.user).toBeDefined();
      expect(res.headers['set-cookie']).toBeDefined();

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user?.lastTimeActive).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout a user and revoke the token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      const cookies = loginRes.headers['set-cookie'];

      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.message).toBe('Logout successful');
      expect(logoutRes.headers['set-cookie']).toBeDefined();

      // Try to access a protected route with the revoked token
      const protectedRes = await request(app)
        .get('/api/users/profile')
        .set('Cookie', cookies);

      expect(protectedRes.status).toBe(401);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        isVerified: true,
      });
    });

    it('should send a password reset email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'test@example.com',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password reset email sent');

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user?.resetPasswordToken).toBeDefined();
      expect(user?.resetPasswordExpires).toBeDefined();

      expect(sendEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Password Reset',
        text: expect.stringContaining('reset-password'),
      });
    });
  });

  describe('POST /api/auth/reset-password/:token', () => {
    let resetToken: string;

    beforeEach(async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        isVerified: true,
        resetPasswordToken: 'validtoken',
        resetPasswordExpires: new Date(Date.now() + 3600000),
      });
      resetToken = user.resetPasswordToken!;
    });

    it('should reset user password', async () => {
      const res = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({
          password: 'newpassword123',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password reset successful');

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user?.resetPasswordToken).toBeUndefined();
      expect(user?.resetPasswordExpires).toBeUndefined();

      // Try logging in with the new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'newpassword123',
        });

      expect(loginRes.status).toBe(200);
    });

    it('should return error for invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password/invalidtoken')
        .send({
          password: 'newpassword123',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid or expired reset token');
    });
  });
});