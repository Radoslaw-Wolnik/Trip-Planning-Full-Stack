import { Server } from 'socket.io';
import { createServer } from 'http';
import { SocketService } from '../../../src/services/socket.service';
import { createClient } from 'redis';

jest.mock('socket.io');
jest.mock('redis');

describe('Socket Service', () => {
  let httpServer: any;
  let socketService: SocketService;
  let mockIo: any;
  let mockRedisClient: any;

  beforeEach(() => {
    httpServer = createServer();
    mockIo = {
      on: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };
    (Server as jest.Mock).mockReturnValue(mockIo);

    mockRedisClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      duplicate: jest.fn().mockReturnThis(),
    };
    (createClient as jest.Mock).mockReturnValue(mockRedisClient);

    socketService = SocketService.getInstance(httpServer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be a singleton', () => {
    const anotherInstance = SocketService.getInstance();
    expect(anotherInstance).toBe(socketService);
  });

  it('should initialize Redis clients', async () => {
    expect(createClient).toHaveBeenCalledWith({ url: expect.any(String) });
    expect(mockRedisClient.connect).toHaveBeenCalledTimes(2);
  });

  it('should set up socket connection handler', () => {
    expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));
  });

  it('should emit trip updates', () => {
    const tripId = 'trip123';
    const updatedData = { title: 'Updated Trip' };

    socketService.emitTripUpdate(tripId, updatedData);

    expect(mockIo.to).toHaveBeenCalledWith(tripId);
    expect(mockIo.emit).toHaveBeenCalledWith('trip-updated', updatedData);
  });

  it('should emit trip deletions', () => {
    const tripId = 'trip123';

    socketService.emitTripDeletion(tripId);

    expect(mockIo.to).toHaveBeenCalledWith(tripId);
    expect(mockIo.emit).toHaveBeenCalledWith('trip-deleted', tripId);
  });

  it('should emit real-time status updates', () => {
    const tripId = 'trip123';
    const enableRealTime = true;

    socketService.emitRealTimeStatus(tripId, enableRealTime);

    expect(mockIo.to).toHaveBeenCalledWith(tripId);
    expect(mockIo.emit).toHaveBeenCalledWith('real-time-status', enableRealTime);
  });
});