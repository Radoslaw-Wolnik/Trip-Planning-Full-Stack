import * as customErrors from '../../../src/utils/custom-errors.util';

describe('Custom Errors', () => {
  it('should create a NotFoundError', () => {
    const error = new customErrors.NotFoundError('User');
    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create an UnauthorizedError', () => {
    const error = new customErrors.UnauthorizedError();
    expect(error.message).toBe('Unauthorized access');
    expect(error.statusCode).toBe(401);
  });

  it('should create a ForbiddenError', () => {
    const error = new customErrors.ForbiddenError();
    expect(error.message).toBe('Access forbidden');
    expect(error.statusCode).toBe(403);
  });

  it('should create a ValidationError', () => {
    const error = new customErrors.ValidationError('Invalid input');
    expect(error.message).toBe('Invalid input');
    expect(error.statusCode).toBe(400);
  });

  it('should create a ConflictError', () => {
    const error = new customErrors.ConflictError('Duplicate entry');
    expect(error.message).toBe('Duplicate entry');
    expect(error.statusCode).toBe(409);
  });

  it('should create an InternalServerError', () => {
    const error = new customErrors.InternalServerError();
    expect(error.message).toBe('Internal server error');
    expect(error.statusCode).toBe(500);
  });

  // Add tests for other custom errors...
});