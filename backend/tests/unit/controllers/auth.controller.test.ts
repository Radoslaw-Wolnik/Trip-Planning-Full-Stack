import { Request, Response } from 'express';
import * as authController from '../../../src/controllers/auth.controller';
import User from '../../../src/models/user.model';
import { generateToken, setTokenCookie } from '../../../src/middleware/auth.middleware';
import { UnauthorizedError, ValidationError, NotFoundError } from '../../../src/utils/custom-errors.util';
import { mockRequest, mockResponse } from 'jest-mock-req-res';

jest.mock('../../../src/models/user.model');
jest.mock('../../../src/middleware/auth.middleware');
jest.mock('../../../src/utils/custom-errors.util');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  describe('register', () => {
    it('should create a new user and return 201 status', async () => {
      req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      const mockUser = { _id: 'user_id', ...req.body, save: jest.fn() };
      (User as jest.Mock).mockImplementation(() => mockUser);

      await authController.register(req as Request, res as Response, next);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User registered. Please check your email to verify your account.'
      }));
    });

    it('should call next with error if user creation fails', async () => {
      req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      const error = new Error('User creation failed');
      (User as jest.Mock).mockImplementation(() => ({ save: jest.fn().mockRejectedValue(error) }));

      await authController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should log in a user and set a token cookie', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = { 
        _id: 'user_id', 
        email: 'test@example.com', 
        isVerified: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn()
      };
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (generateToken as jest.Mock).mockReturnValue('mock_token');

      await authController.login(req as Request, res as Response, next);

      expect(setTokenCookie).toHaveBeenCalledWith(res, 'mock_token');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Login successful',
        user: expect.objectContaining({ id: 'user_id' })
      }));
    });

    it('should return 401 if credentials are invalid', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = { 
        email: 'test@example.com', 
        comparePassword: jest.fn().mockResolvedValue(false) 
      };
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should return 401 if user is not verified', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = { 
        email: 'test@example.com', 
        isVerified: false,
        comparePassword: jest.fn().mockResolvedValue(true) 
      };
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('logout', () => {
    it('should clear the token cookie and return success message', async () => {
      req.cookies = { token: 'valid_token' };

      await authController.logout(req as Request, res as Response, next);

      expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Logout successful'
      }));
    });
  });

  describe('verifyEmail', () => {
    it('should verify user email and return success message', async () => {
      const mockUser = { 
        isVerified: false, 
        verificationToken: 'valid_token',
        verificationTokenExpires: new Date(Date.now() + 3600000),
        save: jest.fn()
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      req.params = { token: 'valid_token' };

      await authController.verifyEmail(req as Request, res as Response, next);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Email verified successfully. You can now log in.'
      }));
    });

    it('should return 410 if verification token is expired', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      req.params = { token: 'expired_token' };

      await authController.verifyEmail(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  // Add more tests for other auth controller functions...
});