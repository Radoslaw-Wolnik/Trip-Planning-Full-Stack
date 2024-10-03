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

export const uploadProductPhotos = (req: Request, res: Response, next: NextFunction) => {
  upload.array('productPictures', environment.product.maxPictures)(req, res, (err) => {
    if (err) {
      handleMulterError(err, req, res, next);
    } else {
      // Process uploaded files
      if (req.files && Array.isArray(req.files)) {
        req.body.images = req.files.map(file => ({
          url: file.path,
          filename: file.filename,
          // You might want to generate or receive altText from the client
          altText: req.body.altText || 'Product image'
        }));
      }
      next();
    }
  });
};



export const uploadDisputeAttachments = (req: Request, res: Response, next: NextFunction) => {
  upload.array('disputeAttachments', 5)(req, res, (err) => {
    if (err) {
      handleMulterError(err, req, res, next);
    } else {
      // Process uploaded files
      if (req.files && Array.isArray(req.files)) {
        req.body.attachments = req.files.map(file => ({
          url: file.path,
          filename: file.filename,
          fileType: file.mimetype
        }));
      }
      next();
    }
  });
};

export const uploadMessagePhotos = (req: Request, res: Response, next: NextFunction) => {
  upload.array('messagePhotos', 5)(req, res, (err) => {
    if (err) {
      handleMulterError(err, req, res, next);
    } else {
      // Process uploaded files
      if (req.files && Array.isArray(req.files)) {
        req.body.attachments = req.files.map(file => ({
          url: file.path,
          filename: file.filename,
          fileType: file.mimetype
        }));
      }
      next();
    }
  });
};