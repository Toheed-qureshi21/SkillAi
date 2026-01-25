import { IUser } from "../types/types.js";

// This function ensures every field is a string and safe for Redis
export const mapUserToRedis = (user: IUser): Record<string, string> => {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    industry: user.industry || "",
    specialization: user.specialization || "",
    yearsOfExperience: user.yearsOfExperience?.toString() || "0",
    skills: JSON.stringify(user.skills || []), // Arrays -> JSON String
    bio: user.bio || "",
    isOnboarded: String(!!user.isOnboarded), // Boolean -> String
    // Add future fields here only once!
  };
};