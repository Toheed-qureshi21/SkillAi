import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerficationToken?: string | null;
  emailVerificationTokenExpires?: Date | null;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerficationToken: { type: String, default: null }, // string | null
    emailVerificationTokenExpires: { type: Date, default: null }, // Date | null
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
