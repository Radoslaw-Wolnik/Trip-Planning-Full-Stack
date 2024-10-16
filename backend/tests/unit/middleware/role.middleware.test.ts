import { Response } from 'express';
import { isAdmin } from '../../../src/middleware/role.middleware';
import { mockAuthRequest, mockResponse } from '../../mocks/express.mock';
import { mockUser } from '../../mocks/user.mock';
import { ForbiddenError } from '../../../src/utils/custom-errors.util';
//import { AuthRequest } from '../../../src/types/global';

describe('Role Middleware', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockAuthRequest();
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isAdmin', () => {
    it('should call next() if user is an admin', () => {
      req.user = mockUser({ role: 'admin' });

      isAdmin(req as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should throw ForbiddenError if user is not an admin', () => {
      req.user = mockUser({ role: 'user' });

      expect(() => isAdmin(req as AuthRequest, res as Response, next)).toThrow(ForbiddenError);
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError if user is not authenticated', () => {
      req.user = undefined;

      expect(() => isAdmin(req as AuthRequest, res as Response, next)).toThrow(ForbiddenError);
      expect(next).not.toHaveBeenCalled();
    });
  });
});