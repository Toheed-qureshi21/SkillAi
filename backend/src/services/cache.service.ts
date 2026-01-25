import { redis } from "../lib/redisClient.js";
import { UserModel } from "../models/User.schema.js";
import { mapUserToRedis } from "../utils/mappers.js";

export const userCacheService = {
  // 1. Get User (Try Cache -> Fallback to DB)
  getUser: async (userId: string) => {
    const cacheKey = `user:${userId}`;
    
    // Try fetching from Redis
    const cachedUser = await redis.hgetall(cacheKey);
    
    // If Redis has data (checking if object has keys), return it
    if (Object.keys(cachedUser).length > 0) {
      // Optional: Parse 'skills' back to array if needed for frontend
      return {
        ...cachedUser,
        skills: JSON.parse(cachedUser.skills || "[]"),
        isOnboarded: cachedUser.isOnboarded === "true",
      };
    }

    // Cache Miss: Fetch from DB
    const user = await UserModel.findById(userId);
    if (!user) return null;

    // Re-populate Cache using the Mapper
    const redisData = mapUserToRedis(user);
    await redis.hset(cacheKey, redisData);
    await redis.expire(cacheKey, 60 * 60 * 24); // 1 Day TTL

    return user; // Return the mongoose doc (or the plain object)
  },

  // 2. Invalidate Cache (Call this after ANY update)
  invalidateUser: async (userId: string) => {
    const cacheKey = `user:${userId}`;
    await redis.del(cacheKey); 
  }
};