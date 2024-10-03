import { Request, Response, NextFunction } from 'express';
import { upload, handleMulterError } from './multer.middleware';
import environment from '../config/environment';

export const uploadProfilePicture = (req: Request, res: Response, next: NextFunction) => {
  upload.single('profilePicture')(req, res, (err) => {
    if (err) {
      handleMulterError(err, req, res, next);
    } else {
      next();
    }
  });
};

