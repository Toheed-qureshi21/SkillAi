import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpires?: Date | null;
  isCredentialsLogin?: boolean;
  isOnboarded?: boolean;
  industry?: string;
  bio?: string;
  specialization?: string;
  yearsOfExperience?: number;
  skills?: string[];

  // Relations
  industryInsight?: mongoose.Types.ObjectId;
  assessments?: mongoose.Types.ObjectId[];
  resume?: mongoose.Types.ObjectId;
  coverLetters?: mongoose.Types.ObjectId[];
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
      trim: true,
    },
    password: {
      type: String,
      minlength: 8, // Minimum 8 characters for security
      validate: {
        validator: function (this: IUser, v: string) {
          // Only validate if credentials login
          return !this.isCredentialsLogin || (!!v && v.length >= 8);
        },
        message: "Password must be at least 8 characters for credentials login",
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationTokenExpires: {
      type: Date,
      default: null,
    },
    isCredentialsLogin: {
      type: Boolean,
      default: true,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    industry: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },

    // Relations
    industryInsight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndustryInsight",
    },
    assessments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
      },
    ],
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
    coverLetters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CoverLetter",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
