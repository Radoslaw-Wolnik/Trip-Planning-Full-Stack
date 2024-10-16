import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as authMiddleware from '../../../src/middleware/auth.middleware';
import User from '../../../src/models/user.model';
import RevokedToken from '../../../src/models/revoked-token.model';
import { mockRequest, mockResponse } from '../../mocks/express.mock';
import { mockUser } from '../../mocks/user.mock';
import * as customErrors from '../../../src/utils/custom-errors.util';

jest.mock('jsonwebtoken');
jest.mock('../../../src/models/user.model');
jest.mock('../../../src/models/revoked-token.model');

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = mockUser();
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      const token = authMiddleware.generateToken(user as any);

      expect(jwt.sign).toHaveBeenCalledWith(
        { user: { id: user._id, role: user.role } },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(token).toBe('mock-token');
    });
  });

  describe('setTokenCookie', () => {
    it('should set a token cookie with correct options', () => {
      const token = 'mock-token';

      authMiddleware.setTokenCookie(res as Response, token);

      expect(res.cookie).toHaveBeenCalledWith('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000
      });
    });
  });

  describe('authenticateJWT', () => {
    it('should authenticate a valid token', async () => {
      const user = mockUser();
      req.cookies = { token: 'valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ user: { id: user._id } });
      (RevokedToken.findOne as jest.Mock).mockResolvedValue(null);
      (User.findById as jest.Mock).mockResolvedValue(user);

      await authMiddleware.authenticateJWT(req as any, res as Response, next);

      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });

    it('should return an error for missing token', async () => {
      req.cookies = {};

      await authMiddleware.authenticateJWT(req as any, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });

    it('should return an error for revoked token', async () => {
      req.cookies = { token: 'revoked-token' };
      (RevokedToken.findOne as jest.Mock).mockResolvedValue({ token: 'revoked-token' });

      await authMiddleware.authenticateJWT(req as any, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.InvalidTokenError));
    });

    it('should return an error for expired token', async () => {
      req.cookies = { token: 'expired-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      await authMiddleware.authenticateJWT(req as any, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.ExpiredTokenError));
    });

    it('should return an error for invalid token', async () => {
      req.cookies = { token: 'invalid-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await authMiddleware.authenticateJWT(req as any, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.InvalidTokenError));
    });
  });

  describe('handleAnonymousAuth', () => {
    it('should authenticate a valid anonymous token', async () => {
      const user = mockUser({ isAnonymous: true });
      req.params = { token: 'valid-anonymous-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ userId: user._id });
      (User.findById as jest.Mock).mockResolvedValue(user);
      (authMiddleware.generateToken as jest.Mock).mockReturnValue('new-token');

      await authMiddleware.handleAnonymousAuth(req as any, res as Response, next);

      expect(authMiddleware.setTokenCookie).toHaveBeenCalledWith(res, 'new-token');
      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });

    it('should return an error for missing token', async () => {
      req.params = {};

      await authMiddleware.handleAnonymousAuth(req as any, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });

    it('should return an error for invalid token', async () => {
      req.params = { token: 'invalid-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware.handleAnonymousAuth(req as any, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });

    it('should return an error for non-anonymous user', async () => {
      const user = mockUser({ isAnonymous: false });
      req.params = { token: 'valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ userId: user._id });
      (User.findById as jest.Mock).mockResolvedValue(user);

      await authMiddleware.handleAnonymousAuth(req as any, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('optionalAuthJWT', () => {
    it('should authenticate a valid token', async () => {
      const user = mockUser();
      req.cookies = { token: 'valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ user: { id: user._id } });
      (User.findById as jest.Mock).mockResolvedValue(user);

      await authMiddleware.optionalAuthJWT(req as any, res as Response, next);

      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });

    it('should continue without authentication if no token is provided', async () => {
      req.cookies = {};

      await authMiddleware.optionalAuthJWT(req as any, res as Response, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it('should continue without authentication for invalid token', async () => {
      req.cookies = { token: 'invalid-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await authMiddleware.optionalAuthJWT(req as any, res as Response, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('handlePostRegistrationAuth', () => {
    it('should authenticate a valid short-lived token', async () => {
      const user = mockUser();
      req.cookies = { shortLivedToken: 'valid-short-lived-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ userId: user._id, shortLived: true });
      (User.findById as jest.Mock).mockResolvedValue(user);
      (authMiddleware.generateToken as jest.Mock).mockReturnValue('new-session-token');

      await authMiddleware.handlePostRegistrationAuth(req as any, res as Response, next);

      expect(res.clearCookie).toHaveBeenCalledWith('shortLivedToken');
      expect(req.user).toEqual(user);
      expect(authMiddleware.setTokenCookie).toHaveBeenCalledWith(res, 'new-session-token');
      expect(next).toHaveBeenCalled();
    });

    it('should return an error for missing short-lived token', async () => {
      req.cookies = {};

      await authMiddleware.handlePostRegistrationAuth(req as any, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });

    it('should return an error for invalid short-lived token', async () => {
      req.cookies = { shortLivedToken: 'invalid-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await authMiddleware.handlePostRegistrationAuth(req as any, res as Response, next);

      expect(res.clearCookie).toHaveBeenCalledWith('shortLivedToken');
      expect(next).toHaveBeenCalledWith(expect.any(customErrors.InvalidTokenError));
    });
  });

  describe('refreshToken', () => {
    it('should refresh a valid token', async () => {
      const user = mockUser();
      req.cookies = { token: 'valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue({ user: { id: user._id } });
      (User.findById as jest.Mock).mockResolvedValue(user);
      (authMiddleware.generateToken as jest.Mock).mockReturnValue('new-token');

      await authMiddleware.refreshToken(req as any, res as Response);

      expect(authMiddleware.setTokenCookie).toHaveBeenCalledWith(res, 'new-token');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token refreshed successfully',
        user: { id: user._id, role: user.role }
      });
    });

    it('should return an error for missing token', async () => {
      req.cookies = {};

      await expect(authMiddleware.refreshToken(req as any, res as Response)).rejects.toThrow(customErrors.UnauthorizedError);
    });

    it('should return an error for expired token', async () => {
      req.cookies = { token: 'expired-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      await expect(authMiddleware.refreshToken(req as any, res as Response)).rejects.toThrow(customErrors.ExpiredTokenError);
    });

    it('should return an error for invalid token', async () => {
      req.cookies = { token: 'invalid-token' };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await expect(authMiddleware.refreshToken(req as any, res as Response)).rejects.toThrow(customErrors.InvalidTokenError);
    });
  });
});