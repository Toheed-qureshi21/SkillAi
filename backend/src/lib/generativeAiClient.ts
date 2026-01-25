import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("Environment variable GEMINI_API_KEY is required");
}

const genAI = new GoogleGenAI({
  apiKey: geminiApiKey,
});

export const genAiModel = {
  async generateContent(prompt: string) {
    return genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });
  },
};
