import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};