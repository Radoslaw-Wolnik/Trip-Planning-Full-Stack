import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { upload, handleMulterError } from '../../../src/middleware/multer.middleware';
import * as customErrors from '../../../src/utils/custom-errors.util';
import { mockRequest, mockResponse } from '../../mocks/express.mock';

jest.mock('multer');
jest.mock('fs');

describe('Multer Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload configuration', () => {
    it('should configure multer with correct settings', () => {
      expect(multer).toHaveBeenCalledWith({
        storage: expect.any(Object),
        fileFilter: expect.any(Function),
        limits: { fileSize: 50 * 1024 * 1024 }
      });
    });

    it('should create correct upload directories', () => {
      const storage = (multer as jest.Mock).mock.calls[0][0].storage;
      const destination = storage.getDestination(req as Request, {} as Express.Multer.File, jest.fn());

      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining('uploads/profile_pictures'), { recursive: true });
    });

    it('should generate correct filenames', () => {
      const storage = (multer as jest.Mock).mock.calls[0][0].storage;
      const filename = storage.getFilename(req as Request, { fieldname: 'profilePicture', originalname: 'test.jpg' } as Express.Multer.File, jest.fn());

      expect(filename).toMatch(/^profilePicture-\d+-\d+\.jpg$/);
    });
  });

  describe('fileFilter', () => {
    let fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => void;

    beforeEach(() => {
      fileFilter = (multer as jest.Mock).mock.calls[0][0].fileFilter;
    });

    it('should accept jpeg and png files', () => {
      const cb = jest.fn();
      fileFilter(req as Request, { mimetype: 'image/jpeg' } as Express.Multer.File, cb);
      expect(cb).toHaveBeenCalledWith(null, true);

      fileFilter(req as Request, { mimetype: 'image/png' } as Express.Multer.File, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('should reject other file types', () => {
      const cb = jest.fn();
      fileFilter(req as Request, { mimetype: 'image/gif' } as Express.Multer.File, cb);
      expect(cb).toHaveBeenCalledWith(expect.any(customErrors.FileTypeNotAllowedError));
    });
  });

  describe('handleMulterError', () => {
    it('should handle LIMIT_FILE_SIZE error', () => {
      const error = new multer.MulterError('LIMIT_FILE_SIZE');
      handleMulterError(error, req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(customErrors.FileSizeTooLargeError));
    });

    it('should handle other MulterError types', () => {
      const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
      handleMulterError(error, req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(customErrors.BadRequestError));
    });

    it('should handle non-MulterError', () => {
      const error = new Error('Random error');
      handleMulterError(error, req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});