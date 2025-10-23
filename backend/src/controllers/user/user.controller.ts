import { Request, Response } from "express";
import { TryCatch } from "../../utils/TryCatch.js";
import { onboardUserValidator } from "../../validators/user.validator.js";
import { UserModel } from "../../models/User.schema.js";
import { IUser } from "../../types/types.js";
import { redis } from "../../lib/redisClient.js";



export const getUserProfile = TryCatch(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  return res.status(200).json({ success: true, user });
});

export const onboardUserToCompleteProfile = TryCatch(
  async (req: Request, res: Response) => {
    // Validate request body
    const result = onboardUserValidator.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ success: false, errors: result.error.issues });
    }

    const { industry, specialization, yearsOfExperience, skills, bio } =
      result.data;

    // Ensure authenticated user
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = req.user as IUser;

    // Update user in MongoDB
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        industry,
        specialization,
        yearsOfExperience,
        isOnboarded: true,
        skills,
        bio,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Cache the updated user in Redis
    const cacheKey = `user-${user._id}`;
    await redis.hset(cacheKey, {
      ...updatedUser.toObject(),
      industry: updatedUser.industry || "",
      specialization: updatedUser.specialization || "",
      yearsOfExperience: updatedUser.yearsOfExperience?.toString() || "0",
      skills: JSON.stringify(updatedUser.skills || []),
      bio: updatedUser.bio || "",
      isOnboarded: updatedUser.isOnboarded,
    });

    // Optional: set TTL, e.g., 24 hours
    // await redis.expire(cacheKey, 60 * 60 * 24);

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user: updatedUser,
    });
  }
);