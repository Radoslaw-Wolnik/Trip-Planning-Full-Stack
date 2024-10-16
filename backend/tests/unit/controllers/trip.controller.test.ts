import { Request, Response } from 'express';
import * as tripController from '../../../src/controllers/trip.controller';
import Trip from '../../../src/models/trip.model';
import User from '../../../src/models/user.model';
import { SocketService } from '../../../src/services/socket.service';
import { mockRequest, mockResponse, mockAuthRequest } from '../../mocks/express.mock';
import { mockTrip } from '../../mocks/trip.mock';
import { mockUser } from '../../mocks/user.mock';
// import { AuthRequest } from '../../../src/types/global';
import * as customErrors from '../../../src/utils/custom-errors.util';

jest.mock('../../../src/models/trip.model');
jest.mock('../../../src/models/user.model');
jest.mock('../../../src/services/socket.service');
jest.mock('../../../src/utils/logger.util');

describe('Trip Controller', () => {
  let req: Partial<Request>;
  let authReq: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    authReq = mockAuthRequest();
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTrip', () => {
    it('should create a new trip successfully', async () => {
      const user = mockUser();
      const newTrip = mockTrip();
      authReq.user = user;
      authReq.body = {
        title: 'New Trip',
        description: 'A great vacation',
        startDate: new Date(),
        endDate: new Date(),
        places: [{ name: 'Paris', date: new Date(), latitude: 48.8566, longitude: 2.3522 }]
      };

      (Trip.prototype.save as jest.Mock).mockResolvedValue(newTrip);
      (User.prototype.save as jest.Mock).mockResolvedValue(user);

      await tripController.createTrip(authReq as AuthRequest, res as Response, next);

      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newTrip);
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await tripController.createTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('getAllUserTrips', () => {
    it('should return all trips for the authenticated user', async () => {
      const user = mockUser();
      const trips = [mockTrip(), mockTrip()];
      authReq.user = user;

      (Trip.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(trips)
        })
      });

      await tripController.getAllUserTrips(authReq as AuthRequest, res as Response, next);

      expect(Trip.find).toHaveBeenCalledWith({
        $or: [
          { creator: user._id },
          { sharedWith: user._id }
        ]
      });
      expect(res.json).toHaveBeenCalledWith(trips);
    });

    it('should return an error if user is not authenticated', async () => {
      authReq.user = undefined;

      await tripController.getAllUserTrips(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('getTrip', () => {
    it('should return a specific trip for the authenticated user', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id });
      authReq.user = user;
      authReq.params = { id: trip._id };

      (Trip.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(trip)
      });

      await tripController.getTrip(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(res.json).toHaveBeenCalledWith(trip);
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.params = { id: 'nonexistent-id' };

      (Trip.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await tripController.getTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user is not authorized to view the trip', async () => {
      const user = mockUser();
      const otherUser = mockUser();
      const trip = mockTrip({ creator: otherUser._id });
      authReq.user = user;
      authReq.params = { id: trip._id };

      (Trip.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(trip)
      });

      await tripController.getTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('updateTrip', () => {
    it('should update a trip successfully', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id });
      authReq.user = user;
      authReq.params = { id: trip._id };
      authReq.body = { title: 'Updated Trip Title' };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (Trip.prototype.save as jest.Mock).mockResolvedValue(trip);

      await tripController.updateTrip(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(SocketService.getInstance().emitTripUpdate).toHaveBeenCalledWith(trip._id.toString(), trip);
      expect(res.json).toHaveBeenCalledWith(trip);
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.params = { id: 'nonexistent-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.updateTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user is not authorized to update the trip', async () => {
      const user = mockUser();
      const otherUser = mockUser();
      const trip = mockTrip({ creator: otherUser._id });
      authReq.user = user;
      authReq.params = { id: trip._id };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);

      await tripController.updateTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('deleteTrip', () => {
    it('should delete a trip successfully', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id });
      authReq.user = user;
      authReq.params = { id: trip._id };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (Trip.findByIdAndDelete as jest.Mock).mockResolvedValue(trip);
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(user);

      await tripController.deleteTrip(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(Trip.findByIdAndDelete).toHaveBeenCalledWith(trip._id);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(user._id, { $pull: { trips: trip._id } });
      expect(SocketService.getInstance().emitTripDeletion).toHaveBeenCalledWith(trip._id.toString());
      expect(res.json).toHaveBeenCalledWith({ message: 'Trip deleted successfully' });
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.params = { id: 'nonexistent-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.deleteTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user is not authorized to delete the trip', async () => {
      const user = mockUser();
      const otherUser = mockUser();
      const trip = mockTrip({ creator: otherUser._id });
      authReq.user = user;
      authReq.params = { id: trip._id };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);

      await tripController.deleteTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('shareTrip', () => {
    it('should share a trip successfully', async () => {
      const user = mockUser();
      const sharedUser = mockUser();
      const trip = mockTrip({ creator: user._id });
      authReq.user = user;
      authReq.params = { id: trip._id };
      authReq.body = { email: sharedUser.email };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (User.findOne as jest.Mock).mockResolvedValue(sharedUser);
      (Trip.prototype.save as jest.Mock).mockResolvedValue(trip);

      await tripController.shareTrip(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(User.findOne).toHaveBeenCalledWith({ email: sharedUser.email });
      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Trip shared successfully', 
        invitationCode: trip.invitationCode 
      });
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.params = { id: 'nonexistent-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.shareTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user to share with is not found', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id });
      authReq.user = user;
      authReq.params = { id: trip._id };
      authReq.body = { email: 'nonexistent@example.com' };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await tripController.shareTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if trip is already shared with the user', async () => {
      const user = mockUser();
      const sharedUser = mockUser();
      const trip = mockTrip({ creator: user._id, sharedWith: [sharedUser._id] });
      authReq.user = user;
      authReq.params = { id: trip._id };
      authReq.body = { email: sharedUser.email };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (User.findOne as jest.Mock).mockResolvedValue(sharedUser);

      await tripController.shareTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.ValidationError));
    });
  });

  describe('joinTrip', () => {
    it('should join a trip successfully', async () => {
      const user = mockUser();
      const trip = mockTrip();
      authReq.user = user;
      authReq.body = { invitationCode: trip.invitationCode };

      (Trip.findOne as jest.Mock).mockResolvedValue(trip);
      (Trip.prototype.save as jest.Mock).mockResolvedValue(trip);

      await tripController.joinTrip(authReq as AuthRequest, res as Response, next);

      expect(Trip.findOne).toHaveBeenCalledWith({ invitationCode: trip.invitationCode });
      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Successfully joined the trip', 
        trip 
      });
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.body = { invitationCode: 'invalid-code' };

      (Trip.findOne as jest.Mock).mockResolvedValue(null);

      await tripController.joinTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user is already part of the trip', async () => {
      const user = mockUser();
      const trip = mockTrip({ sharedWith: [user._id] });
      authReq.user = user;
      authReq.body = { invitationCode: trip.invitationCode };

      (Trip.findOne as jest.Mock).mockResolvedValue(trip);

      await tripController.joinTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.ValidationError));
    });
  });

  describe('leaveTrip', () => {
    it('should leave a trip successfully', async () => {
      const user = mockUser();
      const trip = mockTrip({ sharedWith: [user._id] });
      authReq.user = user;
      authReq.params = { id: trip._id };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (Trip.prototype.save as jest.Mock).mockResolvedValue(trip);

      await tripController.leaveTrip(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Successfully left the trip' });
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.params = { id: 'nonexistent-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.leaveTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user is not part of the trip', async () => {
      const user = mockUser();
      const trip = mockTrip();
      authReq.user = user;
      authReq.params = { id: trip._id };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);

      await tripController.leaveTrip(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('updatePlace', () => {
    it('should update a place in a trip successfully', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id });
      const placeId = trip.places[0]._id;
      authReq.user = user;
      authReq.params = { tripId: trip._id, placeId };
      authReq.body = { name: 'Updated Place', date: new Date(), latitude: 0, longitude: 0 };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (Trip.prototype.save as jest.Mock).mockResolvedValue(trip);

      await tripController.updatePlace(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(SocketService.getInstance().emitTripUpdate).toHaveBeenCalledWith(trip._id.toString(), trip);
      expect(res.json).toHaveBeenCalledWith(trip);
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.params = { tripId: 'nonexistent-id', placeId: 'place-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.updatePlace(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if place is not found in the trip', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id });
      authReq.user = user;
      authReq.params = { tripId: trip._id, placeId: 'nonexistent-place-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);

      await tripController.updatePlace(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });
  });

  describe('addPlace', () => {
    it('should add a new place to a trip successfully', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id });
      authReq.user = user;
      authReq.params = { tripId: trip._id };
      authReq.body = { name: 'New Place', date: new Date(), latitude: 0, longitude: 0 };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (Trip.prototype.save as jest.Mock).mockResolvedValue(trip);

      await tripController.addPlace(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(SocketService.getInstance().emitTripUpdate).toHaveBeenCalledWith(trip._id.toString(), trip);
      expect(res.json).toHaveBeenCalledWith(trip);
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.params = { tripId: 'nonexistent-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.addPlace(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user is not authorized to update the trip', async () => {
      const user = mockUser();
      const otherUser = mockUser();
      const trip = mockTrip({ creator: otherUser._id });
      authReq.user = user;
      authReq.params = { tripId: trip._id };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);

      await tripController.addPlace(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('removePlace', () => {
    it('should remove a place from a trip successfully', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id });
      const placeId = trip.places[0]._id;
      authReq.user = user;
      authReq.params = { tripId: trip._id, placeId };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (Trip.prototype.save as jest.Mock).mockResolvedValue(trip);

      await tripController.removePlace(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(SocketService.getInstance().emitTripUpdate).toHaveBeenCalledWith(trip._id.toString(), trip);
      expect(res.json).toHaveBeenCalledWith(trip);
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.params = { tripId: 'nonexistent-id', placeId: 'place-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.removePlace(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user is not authorized to update the trip', async () => {
      const user = mockUser();
      const otherUser = mockUser();
      const trip = mockTrip({ creator: otherUser._id });
      authReq.user = user;
      authReq.params = { tripId: trip._id, placeId: 'place-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);

      await tripController.removePlace(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('updateRealTimeStatus', () => {
    it('should update real-time status successfully', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id, activeEditors: 1 });
      authReq.user = user;
      authReq.body = { tripId: trip._id, isEditing: true };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (Trip.prototype.save as jest.Mock).mockResolvedValue(trip);

      await tripController.updateRealTimeStatus(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(SocketService.getInstance().emitRealTimeStatus).toHaveBeenCalledWith(trip._id.toString(), true);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Real-time enabled for trip', 
        enableRealTime: true 
      });
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.body = { tripId: 'nonexistent-id', isEditing: true };

      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.updateRealTimeStatus(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user is not authorized to update the trip', async () => {
      const user = mockUser();
      const otherUser = mockUser();
      const trip = mockTrip({ creator: otherUser._id });
      authReq.user = user;
      authReq.body = { tripId: trip._id, isEditing: true };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);

      await tripController.updateRealTimeStatus(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });

  describe('getTripByShareCode', () => {
    it('should get a trip by share code successfully', async () => {
      const trip = mockTrip();
      req.params = { shareCode: trip.shareCode };

      (Trip.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(trip)
      });

      await tripController.getTripByShareCode(req as Request, res as Response, next);

      expect(Trip.findOne).toHaveBeenCalledWith({ shareCode: trip.shareCode });
      expect(res.json).toHaveBeenCalledWith(trip);
    });

    it('should return an error if trip is not found', async () => {
      req.params = { shareCode: 'invalid-share-code' };

      (Trip.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await tripController.getTripByShareCode(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });
  });

  describe('regenerateShareCode', () => {
    it('should regenerate share code successfully', async () => {
      const user = mockUser();
      const trip = mockTrip({ creator: user._id });
      authReq.user = user;
      authReq.params = { id: trip._id };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);
      (Trip.prototype.save as jest.Mock).mockResolvedValue(trip);

      await tripController.regenerateShareCode(authReq as AuthRequest, res as Response, next);

      expect(Trip.findById).toHaveBeenCalledWith(trip._id);
      expect(Trip.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Share code regenerated successfully', 
        shareCode: trip.shareCode 
      });
    });

    it('should return an error if trip is not found', async () => {
      const user = mockUser();
      authReq.user = user;
      authReq.params = { id: 'nonexistent-id' };

      (Trip.findById as jest.Mock).mockResolvedValue(null);

      await tripController.regenerateShareCode(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.NotFoundError));
    });

    it('should return an error if user is not authorized to regenerate share code', async () => {
      const user = mockUser();
      const otherUser = mockUser();
      const trip = mockTrip({ creator: otherUser._id });
      authReq.user = user;
      authReq.params = { id: trip._id };

      (Trip.findById as jest.Mock).mockResolvedValue(trip);

      await tripController.regenerateShareCode(authReq as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(customErrors.UnauthorizedError));
    });
  });
});