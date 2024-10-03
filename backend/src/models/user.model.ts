import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  lastTimeActive?: Date;
  deactivationToken?: string;
  deactivationExpires?: Date;
  deactivated?: Date;
  trips: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: [isEmail, 'Invalid email format'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  profilePicture: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  lastTimeActive: Date,
  deactivationToken: String,
  deactivationExpires: Date,
  deactivated: Date,
  trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);