import { IUserDocument } from '../../src/models/user.model';
import { Types } from 'mongoose';

/*
export const mockUser = (overrides = {}): Partial<IUserDocument> => ({
  _id: new Types.ObjectId().toString(),
  username: 'mockuser',
  email: 'mock@example.com',
  password: 'hashedpassword',
  isVerified: true,
  role: 'user',
  comparePassword: jest.fn().mockResolvedValue(true),
  save: jest.fn().mockResolvedValue(this),
  verificationToken: undefined,
  verificationTokenExpires: undefined,
  //resetPasswordToken: undefined, -- needs to be added to user schema
  //resetPasswordExpires: undefined,
  //oneTimeLoginToken: undefined,
  //oneTimeLoginExpires: undefined,
  deactivationToken: undefined,
  deactivationExpires: undefined,
  deactivated: undefined,
  lastTimeActive: new Date(),
  ...overrides
});
*/

export const mockUser = (overrides = {}): Partial<IUserDocument> => ({
  _id: new Types.ObjectId().toString(),
  username: 'mockuser',
  email: 'mock@example.com',
  password: 'hashedpassword',
  profilePicture: '/uploads/profile_pics/default.jpg',
  isVerified: true,
  role: 'user',
  lastTimeActive: new Date(),
  comparePassword: jest.fn().mockResolvedValue(true),
  save: jest.fn().mockResolvedValue(this),
  toObject: jest.fn().mockReturnValue(this),
  ...overrides
});