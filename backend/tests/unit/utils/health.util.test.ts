import { checkOverallHealth, verifyEmailService } from '../../../src/utils/health.util';
import { checkDBHealth } from '../../../src/utils/db-connection.util';
import environment from '../../../src/config/environment';
import logger from '../../../src/utils/logger.util';

jest.mock('../../../src/utils/db-connection.util');
jest.mock('../../../src/config/environment', () => ({
  email: {
    service: {
      verifyConnection: jest.fn(),
    },
  },
}));
jest.mock('../../../src/utils/logger.util');

describe('Health Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkOverallHealth', () => {
    it('should return true when all checks pass', async () => {
      (checkDBHealth as jest.Mock).mockReturnValue('Connected');
      (environment.email.service.verifyConnection as jest.Mock).mockResolvedValue(undefined);

      const result = await checkOverallHealth();
      expect(result).toBe(true);
    });

    it('should return false when database check fails', async () => {
      (checkDBHealth as jest.Mock).mockReturnValue('Disconnected');
      (environment.email.service.verifyConnection as jest.Mock).mockResolvedValue(undefined);

      const result = await checkOverallHealth();
      expect(result).toBe(false);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should return false when email service check fails', async () => {
      (checkDBHealth as jest.Mock).mockReturnValue('Connected');
      (environment.email.service.verifyConnection as jest.Mock).mockRejectedValue(new Error('Email service error'));

      const result = await checkOverallHealth();
      expect(result).toBe(false);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('verifyEmailService', () => {
    it('should verify email service connection successfully', async () => {
      (environment.email.service.verifyConnection as jest.Mock).mockResolvedValue(undefined);

      await verifyEmailService();
      expect(logger.info).toHaveBeenCalledWith('Email service connection verified');
    });

    it('should throw an error when email service verification fails', async () => {
      (environment.email.service.verifyConnection as jest.Mock).mockRejectedValue(new Error('Verification failed'));

      await expect(verifyEmailService()).rejects.toThrow('Verification failed');
      expect(logger.error).toHaveBeenCalled();
    });
  });
});