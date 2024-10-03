import mongoose, { Document, Schema } from 'mongoose';

interface IRevokedToken extends Document {
  token: string;
  expiresAt: Date;
}

const RevokedTokenSchema = new Schema<IRevokedToken>({
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

export default mongoose.model<IRevokedToken>('RevokedToken', RevokedTokenSchema);