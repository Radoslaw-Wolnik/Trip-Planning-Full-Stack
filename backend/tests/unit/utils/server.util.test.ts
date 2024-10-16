import { gracefulShutdown } from '../../../src/utils/server.util';
import mongoose from 'mongoose';
import logger from '../../../src/utils/logger.util';

jest.mock('mongoose', () => ({
  connection: {
    close: jest.fn(),
  },
}));

jest.mock('../../../src/utils/logger.util', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('Server Utility', () => {
  let mockServer: any;
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

  beforeEach(() => {
    mockServer = {
      close: jest.fn((callback) => callback()),
    };
    jest.clearAllMocks();
  });

  it('should shut down the server and close database connection', async () => {
    await gracefulShutdown(mockServer, 0);

    expect(logger.info).toHaveBeenCalledWith('Closing HTTP server.');
    expect(mockServer.close).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Closing MongoDB connection.');
    expect(mongoose.connection.close).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Exiting process.');
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('should handle errors during shutdown', async () => {
    const error = new Error('Shutdown error');
    mockServer.close = jest.fn((callback) => callback(error));

    await gracefulShutdown(mockServer, 0);

    expect(logger.error).toHaveBeenCalledWith('Error during graceful shutdown:', error);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});