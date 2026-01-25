import { Request, Response } from "express";
import { TryCatch } from "../../utils/TryCatch.js";
import { onboardUserValidator } from "../../validators/user.validator.js";
import { UserModel } from "../../models/User.schema.js";
import { IUser } from "../../types/types.js";
import { redis } from "../../lib/redisClient.js";
import { userCacheService } from "../../services/cache.service.js";



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

    // Update DB
    const updatedUser = await UserModel.findByIdAndUpdate(
       user._id,
       { ...req.body, isOnboarded: true },
       { new: true }
    );

    if (!updatedUser) return res.status(404).json({success:false,message:"User not found"});

    // We don't manually set data here. We wipe the dirty data.
    // The next time 'getUser' is called, it will auto-fetch fresh data.
    await userCacheService.invalidateUser(updatedUser._id.toString());

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  }
);