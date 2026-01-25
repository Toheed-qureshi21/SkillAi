import { IndustryInsight } from "../../models/IndustryInsights.schema.js";
import { generateAIIndustryInsights } from "../../services/industryInsights.service.js";
import { IUser } from "../../types/types.js";
import { TryCatch } from "../../utils/TryCatch.js";
import type { Request, Response } from "express";
import { redis } from "../../lib/redisClient.js";

export const getIndustryInsights = TryCatch(async (req: Request, res: Response) => {
    // 1️⃣ Ensure user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as IUser;
    const userId = user?._id?.toString();
    const cacheKey = `user:${userId}`;

    // 2️⃣ Try to get user from Redis first
    let cachedUser: IUser | null = null;
    const cached = await redis.hget(cacheKey, "user");

    if (cached) {
        try {
            cachedUser = JSON.parse(cached);
        } catch (err) {
            console.warn("Failed to parse cached user JSON, using req.user");
        }
    }

    // Use cached user if available, otherwise req.user
    const userToUse = cachedUser || user;

    // 3️⃣ Return cached industryInsights if present
    if (userToUse.industryInsights) {
        return res.status(200).json({ success: true, insights: userToUse.industryInsights });
    }

    // 4️⃣ Ensure user has an industry
    if (!userToUse.industry) {
        return res.status(400).json({ message: "Industry is required to generate insights" });
    }

    // 5️⃣ Safely fetch or create IndustryInsight with upsert
    const industryInsight = await IndustryInsight.findOneAndUpdate(
        { industry: userToUse.industry }, // query
        {
            $setOnInsert: {
                ...(await generateAIIndustryInsights(userToUse.industry)),
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
            },
        },
        { new: true, upsert: true } // return existing or newly created doc
    );

    // 6️⃣ Assign to user object
    userToUse.industryInsights = industryInsight;

    // 7️⃣ Update Redis cache
    await redis.hset(cacheKey, "user", JSON.stringify(userToUse));

    // 8️⃣ Return the industryInsight
    return res.status(200).json({ success: true, industryInsight });
});
