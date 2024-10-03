import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/custom-errors.util';
import AuthRequest from '../types/global'

export const isOwner = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    throw new ForbiddenError('Owner privileges required.');
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ForbiddenError('Admin privileges required.');
  }
};