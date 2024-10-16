import { Request, Response } from 'express';
import * as authController from '../../../src/controllers/auth.controller';
import User from '../../../src/models/user.model';
import RevokedToken from '../../../src/models/revoked-token.model';
import * as authMiddleware from '../../../src/middleware/auth.middleware';
import * as customErrors from '../../../src/utils/custom-errors.util';
import * as emailService from '../../../src/services/email.service';
import { mockRequest, mockResponse, mockAuthRequest } from '../../mocks/express.mock';
import { mockUser } from '../../mocks/user.mock';
// import { AuthRequest } from '../../../src/types/global';

jest.mock('../../../src/models/user.model');
jest.mock('../../../src/models/revoked-token.model');
jest.mock('../../../src/middleware/auth.middleware');
jest.mock('../../../src/utils/logger.util');
jest.mock('../../../src/services/email.service');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let authReq: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    authReq = mockAuthRequest();
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully log in a user with valid credentials', async () => {
      const user = mockUser();
      (User.findByEmail as jest.Mock).mockResolvedValue(user);
      (user.comparePassword as jest.Mock).mockResolvedValue(true);
      (authMiddleware.generateToken as jest.Mock).mockReturnValue('mock-token');

      req.body = { email: 'test@example.com', password: 'password123' };

      await authController.login(req as Request, res as Response, next);

      expect(User.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(user.comparePassword).toHaveBeenCalledWith('password123');
      expect(authMiddleware.generateToken).toHaveBeenCalledWith(user);
      expect(authMiddleware.setTokenCookie).toHaveBeenCalledWith(res, 'mock-token');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: { id: user._id, role: user.role }
      });
    });

    it('should return an error for missing email or password', async () => {
      req.body = {};

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.BadRequestError));
    });

    it('should return an error for non-existent user', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue(null);
      req.body = { email: 'nonexistent@example.com', password: 'password123' };

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });

    it('should return an error for incorrect password', async () => {
      const user = mockUser();
      (User.findByEmail as jest.Mock).mockResolvedValue(user);
      (user.comparePassword as jest.Mock).mockResolvedValue(false);

      req.body = { email: 'test@example.com', password: 'wrongpassword' };

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });

    it('should return an error if email is not verified', async () => {
      const user = mockUser({ isVerified: false });
      (User.findByEmail as jest.Mock).mockResolvedValue(user);
      (user.comparePassword as jest.Mock).mockResolvedValue(true);

      req.body = { email: 'unverified@example.com', password: 'password123' };

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('postRegistrationLogin', () => {
    it('should successfully log in a user after registration', async () => {
      const user = mockUser();
      authReq.user = user;

      await authController.postRegistrationLogin(authReq as AuthRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: { id: user._id, role: user.role, isVerified: user.isVerified }
      });
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await authController.postRegistrationLogin(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('logout', () => {
    it('should successfully log out a user', async () => {
      const token = 'valid-token';
      req.cookies = { token };
      (RevokedToken.create as jest.Mock).mockResolvedValue({});

      await authController.logout(req as AuthRequest, res as Response, next);

      expect(RevokedToken.create).toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });

    it('should return an error if no token is provided', async () => {
      req.cookies = {};

      await authController.logout(req as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.ValidationError));
    });

    it('should handle token revocation errors', async () => {
      const token = 'valid-token';
      req.cookies = { token };
      (RevokedToken.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await authController.logout(req as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.InternalServerError));
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const newUser = mockUser();
      (User.findByEmail as jest.Mock).mockResolvedValue(null);
      (User.prototype.save as jest.Mock).mockResolvedValue(newUser);
      (authMiddleware.generateShortLivedToken as jest.Mock).mockReturnValue('short-lived-token');

      req.body = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'newpassword123'
      };

      await authController.register(req as Request, res as Response, next);

      expect(User.prototype.save).toHaveBeenCalled();
      expect(authMiddleware.setShortLivedTokenCookie).toHaveBeenCalledWith(res, 'short-lived-token');
      expect(emailService.sendTemplatedEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered. Please check your email to verify your account.'
      });
    });

    it('should update an existing anonymous user', async () => {
      const existingUser = mockUser({ isAnonymous: true });
      (User.findByEmail as jest.Mock).mockResolvedValue(existingUser);

      req.body = {
        username: 'anonymoususer',
        email: 'anonymous@example.com',
        password: 'password123'
      };

      await authController.register(req as Request, res as Response, next);

      expect(existingUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return an error if user already exists', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser());

      req.body = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };

      await authController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.BadRequestError));
    });

    it('should return an error for missing required fields', async () => {
      req.body = { username: 'incomplete' };

      await authController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.BadRequestError));
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh the token', async () => {
      const user = mockUser();
      authReq.user = user;
      (authMiddleware.generateToken as jest.Mock).mockReturnValue('new-token');

      await authController.refreshToken(authReq as AuthRequest, res as Response, next);

      expect(authMiddleware.generateToken).toHaveBeenCalledWith(user);
      expect(authMiddleware.setTokenCookie).toHaveBeenCalledWith(res, 'new-token');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token refreshed successfully',
        user: { id: user._id, role: user.role }
      });
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await authController.refreshToken(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.InternalServerError));
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send a verification email successfully', async () => {
      const user = mockUser({ isVerified: false });
      authReq.user = user;

      await authController.sendVerificationEmail(authReq as AuthRequest, res as Response, next);

      expect(user.save).toHaveBeenCalled();
      expect(emailService.sendTemplatedEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Verification email sent' });
    });

    it('should return an error if user is already verified', async () => {
      const user = mockUser({ isVerified: true });
      authReq.user = user;

      await authController.sendVerificationEmail(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.ConflictError));
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await authController.sendVerificationEmail(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.InternalServerError));
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const user = mockUser({ isVerified: false, verificationToken: 'valid-token' });
      (User.findOne as jest.Mock).mockResolvedValue(user);

      req.params = { token: 'valid-token' };

      await authController.verifyEmail(req as Request, res as Response, next);

      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Email verified successfully. You can now log in.' });
    });

    it('should return an error for invalid or expired token', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      req.params = { token: 'invalid-token' };

      await authController.verifyEmail(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.GoneError));
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.body = { currentPassword: 'oldpassword', newPassword: 'newpassword123' };

      await authController.changePassword(authReq as AuthRequest, res as Response, next);

      expect(user.comparePassword).toHaveBeenCalledWith('oldpassword');
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
    });

    it('should return an error for incorrect current password', async () => {
      const user = mockUser();
      (user.comparePassword as jest.Mock).mockResolvedValue(false);
      authReq.user = user;
      authReq.body = { currentPassword: 'wrongpassword', newPassword: 'newpassword123' };

      await authController.changePassword(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.ValidationError));
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await authController.changePassword(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.InternalServerError));
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset successfully', async () => {
      const user = mockUser();
      (User.findByEmail as jest.Mock).mockResolvedValue(user);

      req.body = { email: 'test@example.com' };

      await authController.requestPasswordReset(req as Request, res as Response, next);

      expect(user.save).toHaveBeenCalled();
      expect(emailService.sendTemplatedEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset email sent' });
    });

    it('should return an error for non-existent user', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue(null);

      req.body = { email: 'nonexistent@example.com' };

      await authController.requestPasswordReset(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const user = mockUser();
      user.resetPasswordToken = 'valid-token';
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
      (User.findOne as jest.Mock).mockResolvedValue(user);

      req.params = { token: 'valid-token' };
      req.body = { password: 'newpassword123' };

      await authController.resetPassword(req as Request, res as Response, next);

      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset successful' });
    });

    it('should return an error for invalid or expired token', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      req.params = { token: 'invalid-token' };
      req.body = { password: 'newpassword123' };

      await authController.resetPassword(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.ValidationError));
    });
  });

  describe('createOwner', () => {
    it('should create an owner account successfully', async () => {
      const newOwner = mockUser({ role: 'owner' });
      (User.findByEmail as jest.Mock).mockResolvedValue(null);
      (User.prototype.save as jest.Mock).mockResolvedValue(newOwner);

      authReq.body = {
        username: 'newowner',
        email: 'newowner@example.com',
        password: 'ownerpassword123'
      };

      await authController.createOwner(authReq as AuthRequest, res as Response, next);

      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Owner account created successfully',
        ownerId: newOwner._id
      });
    });

    it('should return an error if owner account already exists', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser());

      authReq.body = {
        username: 'existingowner',
        email: 'existingowner@example.com',
        password: 'ownerpassword123'
      };

      await authController.createOwner(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.ResourceExistsError));
    });

    it('should return an error for missing required fields', async () => {
      authReq.body = { username: 'incomplete' };

      await authController.createOwner(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.BadRequestError));
    });
  });

  describe('createMagicLink', () => {
    it('should create a magic link for an existing user', async () => {
      const user = mockUser();
      (User.findByEmail as jest.Mock).mockResolvedValue(user);

      req.body = { email: 'test@example.com' };

      await authController.createMagicLink(req as Request, res as Response, next);

      expect(user.save).toHaveBeenCalled();
      expect(emailService.sendTemplatedEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Magic link sent to your email' });
    });

    it('should create a magic link for a new anonymous user', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue(null);
      const newUser = mockUser({ isAnonymous: true });
      (User.prototype.save as jest.Mock).mockResolvedValue(newUser);

      req.body = { email: 'newuser@example.com' };

      await authController.createMagicLink(req as Request, res as Response, next);

      expect(User.prototype.save).toHaveBeenCalled();
      expect(emailService.sendTemplatedEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Magic link sent to your email' });
    });
  });

  describe('loginWithMagicLink', () => {
    it('should log in a user with a valid magic link', async () => {
      const user = mockUser();
      user.oneTimeLoginToken = 'valid-token';
      user.oneTimeLoginExpires = new Date(Date.now() + 900000); // 15 minutes from now
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (authMiddleware.generateToken as jest.Mock).mockReturnValue('session-token');

      req.params = { token: 'valid-token' };

      await authController.loginWithMagicLink(req as Request, res as Response, next);

      expect(user.save).toHaveBeenCalled();
      expect(authMiddleware.setTokenCookie).toHaveBeenCalledWith(res, 'session-token');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: { id: user._id, role: user.role }
      });
    });

    it('should return an error for invalid or expired magic link', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      req.params = { token: 'invalid-token' };

      await authController.loginWithMagicLink(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.BadRequestError));
    });
  });

  describe('requestAccountDeactivation', () => {
    it('should request account deactivation successfully', async () => {
      const user = mockUser();
      authReq.user = user;

      await authController.requestAccountDeactivation(authReq as AuthRequest, res as Response, next);

      expect(user.save).toHaveBeenCalled();
      expect(emailService.sendTemplatedEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Account deactivation email sent' });
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await authController.requestAccountDeactivation(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.BadRequestError));
    });
  });

  describe('deactivateAccount', () => {
    it('should deactivate account successfully', async () => {
      const user = mockUser();
      user.deactivationToken = 'valid-token';
      user.deactivationExpires = new Date(Date.now() + 86400000); // 24 hours from now
      (User.findOne as jest.Mock).mockResolvedValue(user);

      req.params = { token: 'valid-token' };

      await authController.deactivateAccount(req as Request, res as Response, next);

      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Account deactivated successfully' });
    });

    it('should return an error for invalid or expired deactivation token', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      req.params = { token: 'invalid-token' };

      await authController.deactivateAccount(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.BadRequestError));
    });
  });
});