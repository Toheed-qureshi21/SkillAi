import { z } from "zod";

// signup validator
export const signupValidator = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password:z.string().min(6,"Password must be at least 6 characters long").max(32,"Password must not exceed 32 characters"),
});

export type SignupInput = z.infer<typeof signupValidator>;

// --------------------
// Login validator
export const loginValidator = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginInput = z.infer<typeof loginValidator>;