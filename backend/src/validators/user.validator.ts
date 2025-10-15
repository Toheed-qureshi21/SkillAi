import { z } from "zod";
// onboarding user
export const onboardUserValidator = z.object({
  industry: z.string().toLowerCase(),
  specialization: z.string().toLowerCase(),
  yearsOfExperience: z
    .number()
    .min(0, "Years of experience cannot be negative")
    .max(40, "Years of experience seems too high"),
  skills: z
    .array(z.string().toLowerCase())
    .min(1, "At least one skill is required"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters long")
    .max(500, "Bio must not exceed 500 characters"),
});
