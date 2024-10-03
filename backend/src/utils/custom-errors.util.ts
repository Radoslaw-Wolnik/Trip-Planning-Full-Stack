// src/utils/custom-errors.util.ts

export class CustomError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
  }
}


export class ExpiredTokenError extends CustomError {
  constructor(message: string = 'Token has expired') {
    super(message, 401);
  }
}

export class InvalidTokenError extends CustomError {
  constructor(message: string = 'Token is invalid') {
    super(message, 403);
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Too many requests. Please try again later.') {
    super(message, 429); // 429 is the HTTP status code for rate-limiting
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string = 'Service is currently unavailable') {
    super(message, 503); // 503 is the HTTP status code for service unavailable
  }
}

export class UploadError extends CustomError {
  constructor(message: string = 'File upload failed') {
    super(message, 400);
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}

export class ResourceExistsError extends CustomError {
  constructor(resource: string) {
    super(`${resource} already exists`, 409);
  }
}

export class PaymentRequiredError extends CustomError {
  constructor(message: string = 'Payment required') {
    super(message, 402);
  }
}

export class TooManyRequestsError extends CustomError {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
  }
}

export class MethodNotAllowedError extends CustomError {
  constructor(message: string = 'Method not allowed') {
    super(message, 405);
  }
}

export class GoneError extends CustomError {
  constructor(message: string = 'Resource no longer available') {
    super(message, 410);
  }
}

export class FileTypeNotAllowedError extends CustomError {
  constructor(allowedTypes: string[]) {
    super(`File type not allowed. Allowed types are: ${allowedTypes.join(', ')}`, 400);
  }
}

export class FileSizeTooLargeError extends CustomError {
  constructor(maxSize: number) {
    super(`File size too large. Maximum allowed size is ${maxSize / (1024 * 1024)}MB`, 400);
  }
}

export class InsufficientStockError extends CustomError {
  constructor(productName: string) {
    super(`Insufficient stock for product: ${productName}`, 400);
  }
}

export class PaymentError extends CustomError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'PaymentError';
  }
}

export class ShippingError extends CustomError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ShippingError';
  }
}
