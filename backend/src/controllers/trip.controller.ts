// src/controllers/trip.controller.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/global';
import Trip, { ITrip } from '../models/trip.model';
import User from '../models/user.model';
import { NotFoundError, UnauthorizedError, ValidationError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import { SocketService } from '../services/socket.service';
import crypto from 'crypto';

// Helper function to check trip access
const checkTripAccess = (trip: ITrip, userId: string): boolean => {
  return trip.creator.toString() === userId || trip.sharedWith.some(id => id.toString() === userId);
};

export const createTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const { title, description, startDate, endDate, places } = req.body;

    const trip = new Trip({
      title,
      description,
      startDate,
      endDate,
      places,
      creator: req.user._id,
      invitationCode: crypto.randomBytes(3).toString('hex'),
      shareCode: crypto.randomBytes(6).toString('hex')
    });

    await trip.save();

    req.user.trips.push(trip._id);
    await req.user.save();

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

export const getAllUserTrips = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const trips = await Trip.find({
      $or: [
        { creator: req.user._id },
        { sharedWith: req.user._id }
      ]
    }).populate('creator', 'username').sort('-createdAt');

    res.json(trips);
  } catch (error) {
    next(error);
  }
};

export const getTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('creator', 'username');
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (!checkTripAccess(trip, req.user?._id.toString() || '')) {
      throw new UnauthorizedError('Not authorized to view this trip');
    }

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.creator.toString() !== req.user?._id.toString()) {
      throw new UnauthorizedError('Not authorized to update this trip');
    }

    const { title, description, startDate, endDate, places } = req.body;

    trip.title = title || trip.title;
    trip.description = description || trip.description;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.places = places || trip.places;

    await trip.save();

    // Emit trip update event
    SocketService.getInstance().emitTripUpdate(trip._id.toString(), trip);

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.creator.toString() !== req.user?._id.toString()) {
      throw new UnauthorizedError('Not authorized to delete this trip');
    }

    await Trip.findByIdAndDelete(req.params.id);

    // Remove trip from user's trips array
    await User.findByIdAndUpdate(req.user?._id, { $pull: { trips: req.params.id } });

    // Notify all shared users about trip deletion
    SocketService.getInstance().emitTripDeletion(trip._id.toString());

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const shareTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.creator.toString() !== req.user?._id.toString()) {
      throw new UnauthorizedError('Not authorized to share this trip');
    }

    const { email } = req.body;
    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      throw new NotFoundError('User not found');
    }

    if (trip.sharedWith.includes(userToShare._id)) {
      throw new ValidationError('Trip already shared with this user');
    }

    trip.sharedWith.push(userToShare._id);
    await trip.save();

    res.json({ message: 'Trip shared successfully', invitationCode: trip.invitationCode });
  } catch (error) {
    next(error);
  }
};

export const joinTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { invitationCode } = req.body;
    const trip = await Trip.findOne({ invitationCode });
    if (!trip) {
      throw new NotFoundError('Trip not found or invalid invitation code');
    }

    if (trip.sharedWith.includes(req.user?._id)) {
      throw new ValidationError('You are already part of this trip');
    }

    trip.sharedWith.push(req.user?._id);
    await trip.save();

    res.json({ message: 'Successfully joined the trip', trip });
  } catch (error) {
    next(error);
  }
};

export const leaveTrip = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (!trip.sharedWith.includes(req.user?._id)) {
      throw new UnauthorizedError('You are not part of this trip');
    }

    trip.sharedWith = trip.sharedWith.filter(id => id.toString() !== req.user?._id.toString());
    await trip.save();

    res.json({ message: 'Successfully left the trip' });
  } catch (error) {
    next(error);
  }
};

export const updatePlace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId, placeId } = req.params;
    const { name, date, latitude, longitude } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (!checkTripAccess(trip, req.user?._id.toString() || '')) {
      throw new UnauthorizedError('Not authorized to update this trip');
    }

    const placeIndex = trip.places.findIndex(place => place._id.toString() === placeId);
    if (placeIndex === -1) {
      throw new NotFoundError('Place not found in this trip');
    }

    trip.places[placeIndex] = { ...trip.places[placeIndex], name, date, latitude, longitude };
    await trip.save();

    // Emit trip update event
    SocketService.getInstance().emitTripUpdate(trip._id.toString(), trip);

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const addPlace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;
    const { name, date, latitude, longitude } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (!checkTripAccess(trip, req.user?._id.toString() || '')) {
      throw new UnauthorizedError('Not authorized to update this trip');
    }

    trip.places.push({ name, date, latitude, longitude });
    await trip.save();

    // Emit trip update event
    SocketService.getInstance().emitTripUpdate(trip._id.toString(), trip);

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const removePlace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId, placeId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (!checkTripAccess(trip, req.user?._id.toString() || '')) {
      throw new UnauthorizedError('Not authorized to update this trip');
    }

    trip.places = trip.places.filter(place => place._id.toString() !== placeId);
    await trip.save();

    // Emit trip update event
    SocketService.getInstance().emitTripUpdate(trip._id.toString(), trip);

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const updateRealTimeStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId, isEditing } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (!checkTripAccess(trip, req.user?._id.toString() || '')) {
      throw new UnauthorizedError('Not authorized to update this trip');
    }

    if (isEditing) {
      trip.activeEditors += 1;
    } else {
      trip.activeEditors = Math.max(0, trip.activeEditors - 1);
    }

    await trip.save();

    const enableRealTime = trip.activeEditors >= 2;
    SocketService.getInstance().emitRealTimeStatus(trip._id.toString(), enableRealTime);

    res.json({ message: `Real-time ${enableRealTime ? 'enabled' : 'disabled'} for trip`, enableRealTime });
  } catch (error) {
    next(error);
  }
};

export const getTripByShareCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { shareCode } = req.params;
    const trip = await Trip.findOne({ shareCode }).populate('creator', 'username');
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const regenerateShareCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.creator.toString() !== req.user?._id.toString()) {
      throw new UnauthorizedError('Not authorized to regenerate share code for this trip');
    }

    trip.shareCode = crypto.randomBytes(6).toString('hex');
    await trip.save();

    res.json({ message: 'Share code regenerated successfully', shareCode: trip.shareCode });
  } catch (error) {
    next(error);
  }
};