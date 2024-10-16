import { sanitizeData, sanitizeDataAsync } from '../../../src/utils/sanitize.util';

describe('Sanitize Utility', () => {
  const sensitiveData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    creditCard: '1234-5678-9012-3456',
    address: {
      street: '123 Main St',
      city: 'Testville',
      zipCode: '12345'
    },
    preferences: {
      newsletter: true,
      theme: 'dark'
    }
  };

  describe('sanitizeData', () => {
    it('should redact sensitive information', () => {
      const sanitized = sanitizeData(sensitiveData);
      expect(sanitized).toEqual({
        username: 'testuser',
        email: '[REDACTED]',
        password: '[REDACTED]',
        creditCard: '[REDACTED]',
        address: {
          street: '123 Main St',
          city: 'Testville',
          zipCode: '12345'
        },
        preferences: {
          newsletter: true,
          theme: 'dark'
        }
      });
    });

    it('should handle arrays', () => {
      const data = [sensitiveData, { name: 'John', email: 'john@example.com' }];
      const sanitized = sanitizeData(data);
      expect(sanitized[0].email).toBe('[REDACTED]');
      expect(sanitized[1].email).toBe('[REDACTED]');
    });

    it('should handle non-object values', () => {
      expect(sanitizeData('string')).toBe('string');
      expect(sanitizeData(123)).toBe(123);
      expect(sanitizeData(null)).toBe(null);
    });
  });

  describe('sanitizeDataAsync', () => {
    it('should redact sensitive information asynchronously', async () => {
      const sanitized = await sanitizeDataAsync(sensitiveData);
      expect(sanitized).toEqual({
        username: 'testuser',
        email: '[REDACTED]',
        password: '[REDACTED]',
        creditCard: '[REDACTED]',
        address: {
          street: '123 Main St',
          city: 'Testville',
          zipCode: '12345'
        },
        preferences: {
          newsletter: true,
          theme: 'dark'
        }
      });
    });
  });
});