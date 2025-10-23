import { GoogleGenerativeAI } from '@google/generative-ai';
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("Environment variable GEMINI_API_KEY is required");
}
const genAi = new GoogleGenerativeAI(geminiApiKey);

export const genAiModel = genAi.getGenerativeModel({
    model:"gemini-2.5-pro"
})

