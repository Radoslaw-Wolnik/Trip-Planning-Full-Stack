import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  places: [{
    name: String,
    date: Date,
    latitude: Number,
    longitude: Number,
    order: Number
  }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  invitationCode: String
});

export default mongoose.model('Trip', tripSchema);
