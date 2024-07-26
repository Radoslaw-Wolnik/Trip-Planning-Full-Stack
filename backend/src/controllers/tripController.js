import Trip from '../models/Trip.js';
import User from '../models/User.js';
// it was an overkill to use crypto for invitation codes, insted we use helper function to generate them
import crypto from 'crypto';
import { generateInvitationCode } from '../utils/generateInvitationCode.js';


export const createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, places } = req.body;
    const newTrip = new Trip({
      title,
      description,
      startDate,
      endDate,
      places,
      creator: req.user.id
    });

    const savedTrip = await newTrip.save();
    res.json(savedTrip);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ creator: req.user.id });
    res.json(trips);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, places } = req.body;
    const tripFields = {};
    if (title) tripFields.title = title;
    if (description) tripFields.description = description;
    if (startDate) tripFields.startDate = startDate;
    if (endDate) tripFields.endDate = endDate;
    if (places) tripFields.places = places;

    let trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: tripFields },
      { new: true }
    );

    res.json(trip);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
  
export const shareTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!trip.invitationCode) {
      //trip.invitationCode = crypto.randomBytes(6).toString('hex');
      trip.invitationCode = generateInvitationCode();
      await trip.save();
    }

    res.json({ invitationCode: trip.invitationCode });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const joinTrip = async (req, res) => {
  try {
    const { invitationCode } = req.body;
    const trip = await Trip.findOne({ invitationCode });

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.sharedWith.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already joined this trip' });
    }

    trip.sharedWith.push(req.user.id);
    await trip.save();

    const user = await User.findById(req.user.id);
    user.trips.push(trip._id);
    await user.save();

    res.json(trip);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ 
      $or: [
        { creator: req.params.userId },
        { sharedWith: req.params.userId }
      ]
    });
    res.json(trips);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const generateShareLink = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (!trip.shareCode) {
      // it can be implemented in diff way, if u want then a helper function can be declared in utils
      // like generateInvitationCode
      trip.shareCode = crypto.randomBytes(4).toString('hex'); 
      await trip.save();
    }

    res.json({ shareCode: trip.shareCode });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
  
export const getSharedTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ shareCode: req.params.shareCode });
    if (!trip) {
      return res.status(404).json({ message: 'Shared trip not found' });
    }

    // Omit sensitive information
    const sharedTripData = {
      _id: trip._id,
      title: trip.title,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      places: trip.places
    };

    res.json(sharedTripData);
  } catch (error) {
    console.error('Error fetching shared trip:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if the logged-in user is the owner of the trip
    if (trip.creator.toString() === userId) {
      await trip.remove();
      return res.status(200).json({ message: 'Trip deleted successfully' });
    }

    // If not the creator, remove the user from the list of shared IDs
    if (trip.sharedWith.includes(userId)) {
      trip.sharedWith = trip.sharedWith.filter(id => id.toString() !== userId);
      await trip.save();
      return res.status(200).json({ message: 'Removed from shared trip successfully' });
    }

    // If the user is neither the creator nor in the shared list
    return res.status(403).json({ message: 'You do not have permission to modify this trip' });
  } catch (error) {
    console.error('Error modifying trip:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getTripDetails = async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await Trip.findById(tripId)
      .populate('places')
      .populate('sharedWith', 'username profilePicture');
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    res.status(200).json(trip);
  } catch (error) {
    console.error('Error fetching trip details:', error);
    res.status(500).json({ message: 'Error fetching trip details', error: error.message });
  }
};