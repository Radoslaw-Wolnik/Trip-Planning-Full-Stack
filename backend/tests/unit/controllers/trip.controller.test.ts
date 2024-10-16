import { Request, Response } from 'express';
import * as tripController from '../../../src/controllers/trip.controller';
import Trip from '../../../src/models/trip.model';
import User from '../../../src/models/user.model';
import { UnauthorizedError, NotFoundError } from '../../../src/utils/custom-errors.util';
import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { SocketService } from '../../../src/services/socket.service';

jest.mock('../../../src/models/trip.model');
jest.mock('../../../src/models/user.model');
jest.mock('../../../src/services/socket.service');

describe('Trip Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  describe('createTrip', () => {
    it('should create a new trip and return 201 status', async () => {
      req.body = { title: 'Test Trip', description: 'A test trip', startDate: '2023-01-01', endDate: '2023-01-07' };
      req.user = { _id: 'user_id', trips: [], save: jest.fn() };
      const mockTrip = { _id: 'trip_id', ...req.body, save: jest.fn() };
      (Trip as jest.Mock).mockImplementation(() => mockTrip);

      await tripController.createTrip(req as Request, res as Response, next);

      expect(mockTrip.save).toHaveBeenCalled();
      expect(req.user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTrip);
    });

    it('should call next with error if trip creation fails', async () => {
      req.body = { title: 'Test Trip' };
      req.user = { _id: 'user_id', trips: [] };
      const error = new Error('Trip creation failed');
      (Trip as jest.Mock).mockImplementation(() => ({ save: jest.fn().mockRejectedValue(error) }));

      await tripController.createTrip(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllUserTrips', () => {
    it('should return all trips for the user', async () => {
      req.user = { _id: 'user_id' };
      const mockTrips = [{ _id: 'trip1' }, { _id: 'trip2' }];
      (Trip.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockTrips)
        })
      });

      await tripController.getAllUserTrips(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockTrips);
    });
  });

  describe('getTrip', () => {
    it('should return a specific trip', async () => {
      req.params = { id: 'trip_id' };
      req.user = { _id: 'user_id' };
      const mockTrip = { _id: 'trip_id', creator: 'user_id' };
      (Trip.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTrip)
      });

      await tripController.getTrip(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockTrip);
    });

    it('should return 404 if trip is not found', async () => {
      req.params = { id: 'nonexistent_trip' };
      (Trip.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await tripController.getTrip(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  describe('updateTrip', () => {
    it('should update a trip and return the updated trip', async () => {
      req.params = { id: 'trip_id' };
      req.body = { title: 'Updated Trip' };
      req.user = { _id: 'user_id' };
      const mockTrip = { 
        _id: 'trip_id', 
        creator: 'user_id',
        title: 'Old Title',
        save: jest.fn()
      };
      (Trip.findById as jest.Mock).mockResolvedValue(mockTrip);
      const socketServiceMock = SocketService.getInstance as jest.Mock;
      socketServiceMock.mockReturnValue({ emitTripUpdate: jest.fn() });

      await tripController.updateTrip(req as Request, res as Response, next);

      expect(mockTrip.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Trip' }));
      expect(socketServiceMock().emitTripUpdate).toHaveBeenCalled();
    });

    it('should return 404 if trip is not found', async () => {
      req.params = { id: 'nonexistent_trip' };
      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.updateTrip(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    it('should return 401 if user is not the creator of the trip', async () => {
      req.params = { id: 'trip_id' };
      req.user = { _id: 'user_id' };
      const mockTrip = { _id: 'trip_id', creator: 'other_user_id' };
      (Trip.findById as jest.Mock).mockResolvedValue(mockTrip);

      await tripController.updateTrip(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  // Add more tests for other trip controller functions...
});