import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpires?: Date | null;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
      minlength: 3,
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null }, // string | null
    emailVerificationTokenExpires: { type: Date, default: null }, // Date | null
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
