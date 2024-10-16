import { Request, Response } from 'express';
import { errorHandler } from '../../../src/middleware/error.middleware';
import * as customErrors from '../../../src/utils/custom-errors.util';
import { mockRequest, mockResponse } from '../../mocks/express.mock';
import logger from '../../../src/utils/logger.util';

jest.mock('../../../src/utils/logger.util');

describe('Error Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle CustomError', () => {
    const error = new customErrors.NotFoundError('Resource');
    
    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 404,
      message: 'Resource not found',
      stack: expect.any(String)
    });
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should handle ValidationError', () => {
    const error: any = new Error('Validation Error');
    error.name = 'ValidationError';
    error.errors = { field1: { message: 'Field1 is required' } };

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 400,
      message: 'Validation Error',
      errors: ['Field1 is required'],
      stack: expect.any(String)
    });
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should handle MongoServerError (duplicate key)', () => {
    const error: any = new Error('Duplicate key error');
    error.name = 'MongoServerError';
    error.code = 11000;
    error.keyValue = { email: 'test@example.com' };

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 409,
      message: 'Duplicate Key Error',
      errors: ['Duplicate value for email'],
      stack: expect.any(String)
    });
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should handle JsonWebTokenError', () => {
    const error: any = new Error('Invalid token');
    error.name = 'JsonWebTokenError';

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 401,
      message: 'Invalid token',
      stack: expect.any(String)
    });
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should handle TokenExpiredError', () => {
    const error: any = new Error('Token expired');
    error.name = 'TokenExpiredError';

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 401,
      message: 'Token expired',
      stack: expect.any(String)
    });
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should handle unknown errors', () => {
    const error = new Error('Unknown error');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'An unexpected error occurred',
      stack: expect.any(String)
    });
    expect(logger.error).toHaveBeenCalled();
  });

  it('should not include stack trace in production', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Production error');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error'
    });
    expect(logger.error).toHaveBeenCalled();
  });
});