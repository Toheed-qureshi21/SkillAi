import { IndustryInsight } from "../../models/IndustryInsights.schema.js";
import { generateAIIndustryInsights } from "../../services/industryInsights.service.js";
import { IUser } from "../../types/types.js";
import { TryCatch } from "../../utils/TryCatch.js";
import type { Request, Response } from "express";
import { redis } from "../../lib/redisClient.js";

export const getIndustryInsights = TryCatch(async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as IUser;
    const userId = user._id;
    const cacheKey = `user:${userId}`;

    // Try to get user from Redis first
    const cached = await redis.hget(cacheKey, "user");
    let cachedUser: IUser | null = null;

    if (cached) {
        try {
            cachedUser = JSON.parse(cached);
        } catch (err) {
            console.warn("Failed to parse cached user JSON, using req.user");
        }
    }

    // Use cached user if available, otherwise req.user
    const userToUse = cachedUser || user;

    // If industryInsights already exists, return it
    if (userToUse.industryInsights) {
        return res.status(200).json({ success: true, insights: userToUse.industryInsights });
    }

    // Ensure industry is available
    if (!userToUse.industry) {
        return res.status(400).json({ message: "Industry is required to generate insights" });
    }

    // Check if IndustryInsight already exists in DB
    let industryInsight = await IndustryInsight.findOne({ industry: userToUse.industry });

    if (!industryInsight) {
        // Generate new insights using AI service
        const insights = await generateAIIndustryInsights(userToUse.industry);

        // Create IndustryInsight in DB
        industryInsight = await IndustryInsight.create({
            industry: userToUse.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
        });
    }

    // Assign to user object
    userToUse.industryInsights = industryInsight;

    // Update Redis cache
    await redis.hset(cacheKey, "user", JSON.stringify(userToUse));

    return res.status(200).json({ success: true, industryInsight });
});
