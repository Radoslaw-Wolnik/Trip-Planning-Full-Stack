// models/RevokedToken.js
import mongoose from 'mongoose';

const RevokedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

export default mongoose.model('RevokedToken', RevokedTokenSchema);