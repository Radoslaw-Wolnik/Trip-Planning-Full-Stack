import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { FileFilterCallback } from 'multer';
import { FileTypeNotAllowedError, FileSizeTooLargeError, BadRequestError } from '../utils/custom-errors.util';
import environment from '../config/environment';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: (req: AuthRequestWithFile, file: Express.Multer.File, cb: DestinationCallback) => {
    let uploadPath: string;

    if (file.fieldname === 'profilePicture') {
      const userId = req.user?.id || 'anonymous';
      uploadPath = `uploads/profile_pictures/${userId}`;
    } else if (file.fieldname === 'productPictures') {
      const productId = req.params.productId || 'temp'; // use temp if productID is not avaliable
      uploadPath = `uploads/products/${productId}/`;
    } else if (file.fieldname === 'disputeAttachments') {
      const disputeId = req.params.disputeId || 'temp';
      uploadPath = `uploads/disputes/${disputeId}/`;
    } else if (file.fieldname === 'messagePhotos') {
      const userId = req.user?.id || 'anonymous';
      uploadPath = `uploads/messages/${userId}/`;
    } else {
      return cb(new Error('Invalid field name'), '');
    }

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req: AuthRequestWithFile, file: Express.Multer.File, cb: FileNameCallback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let variant = '';
    if (file.fieldname === 'productPictures' && req.body.variant) {
      variant = `-${req.body.variant}`;
    }
    cb(null, `${file.fieldname}${variant}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new FileTypeNotAllowedError(['jpeg', 'png', 'gif', 'mp4', 'mov']));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
    files: environment.product.maxPictures
  }
});

export const handleMulterError = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new FileSizeTooLargeError(50 * 1024 * 1024));
    } else {
      next(new BadRequestError(err.message));
    }
  } else if (err instanceof Error) {
    next(err);
  } else {
    next(new BadRequestError('Unknown error during file upload'));
  }
};

export const multerErrorHandler = (multerMiddleware: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    multerMiddleware(req, res, (err: any) => {
      if (err) {
        next(err);
      } else {
        next();
      }
    });
  };
};