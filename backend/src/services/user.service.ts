import crypto from "crypto";
import { UserModel } from "../models/User.schema.js";
import { redis } from "../lib/redisClient.js";

export const generateVerificationToken = (digit = 6) => {
  const min = 10 ** (digit - 1);
  const max = 10 ** digit;
  const token = crypto.randomInt(min, max).toString();
  const expires = new Date(Date.now() + 120 * 1000);
  return { token, expires };
};

export const fetchUserProfile = async (id: string): Promise<any | null> => {
  try {
    // Validate ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error("Invalid user ID format");
    }
    const cached = await redis.hgetall(`user:${id}`);
    if (cached && cached?.user) {
        return JSON.parse(cached.user);
    }
    const user = await UserModel.findById(id)
      .select("-password")
      .select("-emailVerificationToken")
      .select("-emailVerificationTokenExpires");

    if (!user) {
      return null;
    }
    const plainUser = user.toObject()
    await redis.hset(`user:${user._id}`, { user: JSON.stringify(plainUser) });
    await redis.expire(`user:${user._id}`, 24 * 60 * 60 * 1000);
    return user;
  } catch (error) {
    console.error(`Error fetching user profile for ID ${id}:`, error);
    throw error;
  }
};
