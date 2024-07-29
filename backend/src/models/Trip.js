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
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  invitationCode: String,
  shareCode: { type: String, unique: true, sparse: true }
});

export default mongoose.model('Trip', tripSchema);
