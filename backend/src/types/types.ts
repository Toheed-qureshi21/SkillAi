import mongoose, { Document } from "mongoose";

// user type
export interface IUser extends Document {
  name: string;
  email: string;
  password: string ;
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
  industryInsights?: IndustryInsightDoc;
  assessments?: mongoose.Types.ObjectId[];
  resume?: mongoose.Types.ObjectId;
  coverLetters?: mongoose.Types.ObjectId[];
}

// industryInsights types
export interface SalaryRange {
  role: string;
  min: number;
  max: number;
  median: number;
  location?: string;
}

export interface IndustryInsightDoc extends Document {
  industry: string;
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevel: "High" | "Medium" | "Low";
  topSkills: string[];
  marketOutlook: "Positive" | "Neutral" | "Negative";
  keyTrends: string[];
  recommendedSkills: string[];
  nextUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}
