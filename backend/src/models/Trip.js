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
  invitationCode: { type: String, length: 6},
  shareCode: { type: String, unique: true, sparse: true },
  activeEditors: { type: Number, default: 0 }
});

export default mongoose.model('Trip', tripSchema);
