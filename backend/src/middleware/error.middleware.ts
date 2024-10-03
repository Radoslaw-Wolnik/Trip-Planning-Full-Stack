// src/middleware/error-handler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import environment from '../config/environment';
import logger from '../utils/logger.util';
import { CustomError } from '../utils/custom-errors.util';
import { sanitizeData } from '../utils/sanitize.util';


interface ErrorResponse {
  status: string;
  statusCode: number;
  message: string;
  errors?: string[];
  stack?: string;
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let logLevel: 'error' | 'warn' | 'info' = 'error';
  let errors: string[] | undefined;

  // Determine the appropriate status code and message based on the error type
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
    logLevel = err.statusCode >= 500 ? 'error' : (err.statusCode >= 400 ? 'warn' : 'info');
  } else if (err.name === 'ValidationError' && err instanceof Error) {
    statusCode = 400;
    message = 'Validation Error';
    logLevel = 'warn';
    errors = Object.values((err as any).errors).map((e: any) => e.message);
  } else if (err instanceof MongooseError) {
    if (err instanceof MongooseError.ValidationError) {
      statusCode = 400;
      message = 'Validation Error';
      errors = Object.values(err.errors).map(e => e.message);
    } else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
      statusCode = 409;
      message = 'Duplicate Key Error';
      const keyValue = (err as any).keyValue;
      errors = [`Duplicate value for ${Object.keys(keyValue).join(', ')}`];
    } else {
      statusCode = 500;
      message = 'Database Error';
    }
    logLevel = 'warn';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    logLevel = 'warn';
  } else {
    // Any unhandled errors
    statusCode = 500;
    message = 'An unexpected error occurred';
    logLevel = 'error';
  }

  // Prepare log data, sanitizing sensitive information
  const logData = {
    error: err.message,
    stack: err.stack,
    statusCode,
    method: req.method,
    path: req.path,
    body: sanitizeData(req.body),
    query: sanitizeData(req.query),
    params: sanitizeData(req.params),
    ip: req.ip,
    userId: (req as any).user?.id,
  };

  // Log the error with the appropriate level
  logger[logLevel](`${statusCode} - ${message}`, logData);

  // Prepare the response
  const response: ErrorResponse = {
    status: 'error',
    statusCode,
    message: environment.app.nodeEnv === 'production' ? message : err.message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }


  // In development, include the error stack
  if (environment.app.nodeEnv !== 'production') {
    response.stack = err.stack;
  }

  // Send the response
  res.status(statusCode).json(response);
};


/* Sample logging in high-traffic production enviorements
const SAMPLE_RATE = 0.1; // Log 10% of errors with full details

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const shouldLogDetails = Math.random() < SAMPLE_RATE;

  if (shouldLogDetails) {
    const sanitizedBody = sanitizeData(req.body);
    const sanitizedQuery = sanitizeData(req.query);
    const sanitizedParams = sanitizeData(req.params);

    logger.error(`Error: ${err.message}`, {
      stack: err.stack,
      body: sanitizedBody,
      query: sanitizedQuery,
      params: sanitizedParams
    });
  } else {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
  }

  // ... rest of your error handling logic
};
*/