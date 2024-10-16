import logger from '../../../src/utils/logger.util';

describe('Logger Utility', () => {
  const originalEnv = process.env.NODE_ENV;

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should use development logger in non-production environment', () => {
    process.env.NODE_ENV = 'development';
    const devLogger = require('../../../src/utils/logger-dev.util').default;
    expect(logger).toBe(devLogger);
  });

  it('should use production logger in production environment', () => {
    process.env.NODE_ENV = 'production';
    jest.resetModules();
    const prodLogger = require('../../../src/utils/logger-prod.util').default;
    const logger = require('../../../src/utils/logger.util').default;
    expect(logger).toBe(prodLogger);
  });
});