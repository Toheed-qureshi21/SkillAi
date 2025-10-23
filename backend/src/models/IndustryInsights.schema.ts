import mongoose from "mongoose";
import { IndustryInsightDoc } from "../types/types.js";

const industryInsightSchema = new mongoose.Schema(
    {
        industry: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },

        salaryRanges: [
            {
                role: { type: String, required: true },
                min: { type: Number, required: true },
                max: { type: Number, required: true },
                median: { type: Number, required: true },
                location: { type: String },
            },
        ],

        growthRate: { type: Number, required: true },
        demandLevel: {
            type: String,
            enum: ["High", "Medium", "Low"],
            required: true,
        },
        topSkills: [{ type: String }],

        marketOutlook: {
            type: String,
            enum: ["Positive", "Neutral", "Negative"],
            required: true,
        },
        keyTrends: [{ type: String }],

        recommendedSkills: [{ type: String }],

        nextUpdate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export const IndustryInsight = mongoose.model<IndustryInsightDoc>("IndustryInsight", industryInsightSchema);
