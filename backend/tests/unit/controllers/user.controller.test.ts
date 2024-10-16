import { Request, Response } from 'express';
import * as userController from '../../../src/controllers/user.controller';
import User from '../../../src/models/user.model';
import { UnauthorizedError, NotFoundError } from '../../../src/utils/custom-errors.util';
import { mockRequest, mockResponse } from 'jest-mock-req-res';

jest.mock('../../../src/models/user.model');

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  describe('getUserProfile', () => {
    it('should return user profile without password', async () => {
      const mockUser = {
        _id: 'user_id',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        toObject: jest.fn().mockReturnValue({
          _id: 'user_id',
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedpassword'
        })
      };
      req.user = mockUser;

      await userController.getUserProfile(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'user_id',
        username: 'testuser',
        email: 'test@example.com'
      }));
      expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({
        password: expect.anything