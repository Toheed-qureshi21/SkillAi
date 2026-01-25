import { genAiModel } from "../lib/generativeAiClient.js";

export const generateAIIndustryInsights = async (industry: string) => {
  const prompt = `
Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

IMPORTANT: Return ONLY the JSON. No markdown. No explanation.
`;

  const result = await genAiModel.generateContent(prompt);

  if (!result.text) {
    throw new Error("Gemini returned no text output");
  }

  const cleanedText = result.text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
};
