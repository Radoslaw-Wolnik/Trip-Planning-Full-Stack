import { ITrip } from '../../src/models/trip.model';
import { Types } from 'mongoose';
import { mockUser } from './user.mock';

export const mockTrip = (overrides = {}): Partial<ITrip> => ({
  _id: new Types.ObjectId().toString(),
  title: 'Mock Trip',
  description: 'A great mock vacation',
  startDate: new Date(),
  endDate: new Date(),
  places: [
    {
      _id: new Types.ObjectId().toString(),
      name: 'Mock Place',
      date: new Date(),
      latitude: 0,
      longitude: 0,
    },
  ],
  creator: mockUser()._id,
  sharedWith: [],
  invitationCode: 'mock-invite-code',
  shareCode: 'mock-share-code',
  activeEditors: 0,
  save: jest.fn().mockResolvedValue(this),
  ...overrides,
});