import Trip from '../models/Trip.js';
import User from '../models/User.js';
// it was an overkill to use crypto for invitation codes, insted we use helper function to generate them
//import crypto from 'crypto';

// Helper function to generate a random string
const generateInvitationCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };


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