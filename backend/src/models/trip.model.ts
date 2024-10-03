import mongoose, { Document, Schema } from 'mongoose';

interface IPlace {
  name: string;
  date: Date;
  latitude: number;
  longitude: number;
}

export interface ITrip extends Document {
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  places: IPlace[];
  creator: mongoose.Types.ObjectId;
  sharedWith: mongoose.Types.ObjectId[];
  invitationCode: string;
  shareCode: string;
  activeEditors: number;
}

const placeSchema = new Schema<IPlace>({
  name: { type: String, required: [true, 'Place name is required'] },
  date: { type: Date, required: [true, 'Date is required'] },
  latitude: { type: Number, required: [true, 'Latitude is required'] },
  longitude: { type: Number, required: [true, 'Longitude is required'] },
});

const tripSchema = new Schema<ITrip>({
  title: { type: String, required: [true, 'Trip title is required'] },
  description: String,
  startDate: Date,
  endDate: Date,
  places: [placeSchema],
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  invitationCode: { type: String, required: true, unique: true },
  shareCode: { type: String, required: true, unique: true },
  activeEditors: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ITrip>('Trip', tripSchema);