import { Response } from 'express';
import * as userController from '../../../src/controllers/user.controller';
import User from '../../../src/models/user.model';
import { mockResponse, mockAuthRequest } from '../../mocks/express.mock';
import { mockUser } from '../../mocks/user.mock';
//import { AuthRequest } from '../../../src/types/global';
import * as customErrors from '../../../src/utils/custom-errors.util';
import * as fileUtil from '../../../src/utils/delete-file.util';

jest.mock('../../../src/models/user.model');
jest.mock('../../../src/utils/logger.util');
jest.mock('../../../src/utils/delete-file.util');

describe('User Controller', () => {
  let authReq: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    authReq = mockAuthRequest();
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return user profile successfully', async () => {
      const user = mockUser();
      authReq.user = user;

      await userController.getUserProfile(authReq as AuthRequest, res as Response, next);

      const expectedUser = { ...user.toObject(), password: undefined };
      expect(res.json).toHaveBeenCalledWith(expectedUser);
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await userController.getUserProfile(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.body = { username: 'newusername', email: 'newemail@example.com' };

      await userController.updateUserProfile(authReq as AuthRequest, res as Response, next);

      expect(user.save).toHaveBeenCalled();
      const expectedUser = { ...user.toObject(), password: undefined };
      expect(res.json).toHaveBeenCalledWith(expectedUser);
    });

    it('should update only provided fields', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.body = { username: 'newusername' };

      await userController.updateUserProfile(authReq as AuthRequest, res as Response, next);

      expect(user.username).toBe('newusername');
      expect(user.email).toBe(user.email);
      expect(user.save).toHaveBeenCalled();
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await userController.updateUserProfile(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('deactivateAccount', () => {
    it('should deactivate account successfully', async () => {
      const user = mockUser();
      authReq.user = user;

      await userController.deactivateAccount(authReq as AuthRequest, res as Response, next);

      expect(user.deactivated).toBeDefined();
      expect(user.deactivationToken).toBeDefined();
      expect(user.deactivationExpires).toBeDefined();
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Account deactivated successfully' });
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await userController.deactivateAccount(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('reactivateAccount', () => {
    it('should reactivate account successfully', async () => {
      const user = mockUser({
        deactivated: new Date(),
        deactivationToken: 'valid-token',
        deactivationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      (User.findOne as jest.Mock).mockResolvedValue(user);

      authReq.params = { token: 'valid-token' };

      await userController.reactivateAccount(authReq as AuthRequest, res as Response, next);

      expect(user.deactivated).toBeUndefined();
      expect(user.deactivationToken).toBeUndefined();
      expect(user.deactivationExpires).toBeUndefined();
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Account reactivated successfully' });
    });

    it('should return an error for invalid or expired token', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      authReq.params = { token: 'invalid-token' };

      await userController.reactivateAccount(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });
  });

  describe('updateLastActiveTime', () => {
    it('should update last active time successfully', async () => {
      const user = mockUser();
      authReq.user = user;

      await userController.updateLastActiveTime(authReq as AuthRequest, res as Response, next);

      expect(user.lastTimeActive).toBeDefined();
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Last active time updated successfully' });
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await userController.updateLastActiveTime(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('uploadProfilePicture', () => {
    it('should upload profile picture successfully', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.file = {
        filename: 'newprofilepic.jpg',
        path: '/path/to/uploads/newprofilepic.jpg',
      } as Express.Multer.File;

      (User.findById as jest.Mock).mockResolvedValue(user);

      await userController.uploadProfilePicture(authReq as AuthRequest & { file: Express.Multer.File }, res as Response, next);

      expect(user.profilePicture).toBe(`/uploads/profile_pics/${user._id}/newprofilepic.jpg`);
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile picture updated successfully',
        profilePicture: `/uploads/profile_pics/${user._id}/newprofilepic.jpg`
      });
    });

    it('should return an error if no file is uploaded', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.file = undefined;

      await userController.uploadProfilePicture(authReq as AuthRequest & { file?: Express.Multer.File }, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
    });

    it('should return an error if user is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.file = {
        filename: 'newprofilepic.jpg',
        path: '/path/to/uploads/newprofilepic.jpg',
      } as Express.Multer.File;

      (User.findById as jest.Mock).mockResolvedValue(null);

      await userController.uploadProfilePicture(authReq as AuthRequest & { file: Express.Multer.File }, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle errors during file upload', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.file = {
        filename: 'newprofilepic.jpg',
        path: '/path/to/uploads/newprofilepic.jpg',
      } as Express.Multer.File;

      (User.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      await userController.uploadProfilePicture(authReq as AuthRequest & { file: Express.Multer.File }, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
      expect(next).toHaveBeenCalled();
    });

    it('should delete old profile picture if it exists', async () => {
      const user = mockUser({ profilePicture: '/uploads/profile_pics/oldpic.jpg' });
      authReq.user = user;
      authReq.file = {
        filename: 'newprofilepic.jpg',
        path: '/path/to/uploads/newprofilepic.jpg',
      } as Express.Multer.File;

      (User.findById as jest.Mock).mockResolvedValue(user);
      (fileUtil.deleteFileFromStorage as jest.Mock).mockResolvedValue(undefined);

      await userController.uploadProfilePicture(authReq as AuthRequest & { file: Express.Multer.File }, res as Response, next);

      expect(fileUtil.deleteFileFromStorage).toHaveBeenCalledWith('/uploads/profile_pics/oldpic.jpg');
      expect(user.profilePicture).toBe(`/uploads/profile_pics/${user._id}/newprofilepic.jpg`);
      expect(user.save).toHaveBeenCalled();
    });
  });
});