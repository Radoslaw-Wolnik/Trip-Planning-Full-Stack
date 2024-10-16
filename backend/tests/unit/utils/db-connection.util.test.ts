import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB, { checkDBHealth } from '../../../src/utils/db-connection.util';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    readyState: 1,
  },
}));

jest.mock('mongodb-memory-server', () => ({
  MongoMemoryServer: {
    create: jest.fn().mockResolvedValue({
      getUri: jest.fn().mockReturnValue('mock-uri'),
    }),
  },
}));

describe('Database Connection Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('connectDB', () => {
    it('should connect to MongoDB successfully', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);
      await connectDB();
      expect(mongoose.connect).toHaveBeenCalledWith('mock-uri', expect.any(Object));
    });

    it('should retry connection on failure', async () => {
      (mongoose.connect as jest.Mock)
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValueOnce(undefined);

      await connectDB();

      expect(mongoose.connect).toHaveBeenCalledTimes(2);
    });

    it('should exit process after maximum retry attempts', async () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      (mongoose.connect as jest.Mock).mockRejectedValue(new Error('Connection failed'));

      await connectDB();

      expect(mongoose.connect).toHaveBeenCalledTimes(5);
      expect(mockExit).toHaveBeenCalledWith(1);

      mockExit.mockRestore();
    });
  });

  describe('checkDBHealth', () => {
    it('should return "Connected" when readyState is 1', () => {
      mongoose.connection.readyState = 1;
      expect(checkDBHealth()).toBe('Connected');
    });

    it('should return "Disconnected" when readyState is 0', () => {
      mongoose.connection.readyState = 0;
      expect(checkDBHealth()).toBe('Disconnected');
    });

    it('should return "Connecting" when readyState is 2', () => {
      mongoose.connection.readyState = 2;
      expect(checkDBHealth()).toBe('Connecting');
    });

    it('should return "Disconnecting" when readyState is 3', () => {
      mongoose.connection.readyState = 3;
      expect(checkDBHealth()).toBe('Disconnecting');
    });

    it('should return "Unknown" for any other readyState', () => {
      mongoose.connection.readyState = 4;
      expect(checkDBHealth()).toBe('Unknown');
    });
  });
});