// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },

  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: Date,

  lastTimeActive: Date,
  deactivationToken: { type: String },
  deactivationExpires: Date,
  deactivated: Date || null,
  
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
});

export default mongoose.model('User', userSchema);