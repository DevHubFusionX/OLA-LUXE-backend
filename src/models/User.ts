import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  otp?: string;
  otpExpiry?: Date;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', userSchema);
