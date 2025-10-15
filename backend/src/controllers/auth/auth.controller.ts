import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { TryCatch } from "../../utils/TryCatch.js";
import {
  loginValidator,
  SignupInput,
  signupValidator,
} from "../../validators/auth.validator.js";
import { IUser, UserModel } from "../../models/User.schema.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { sendJwtTokensInCookies } from "../../utils/cookies.js";
import { sendVerificationEmail } from "../../utils/sendEmail.js";
import { generateVerificationToken } from "../../services/user.service.js";
import { z } from "zod";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../constant/constants.js";
import { redis } from "../../lib/redisClient.js";


// Signup controller
export const signup = TryCatch(async (req: Request, res: Response) => {
  const result = signupValidator.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({
      errors: result.error.issues.map((err: z.ZodIssue) => ({
        field: err.path[0],
        message: err.message,
      })),
    });

  const { name, email, password }: SignupInput = result.data;

  // Check if user exists in Redis first
  const userKeys = await redis.keys("user:*");
  for (const key of userKeys) {
    const cached = await redis.hgetall(key);
    if (cached?.user && JSON.parse(cached.user).email === email)
      return res.status(400).json({ message: "You are already registered, please login" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const { token, expires } = generateVerificationToken(6);

  const userData = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    emailVerificationToken: token,
    emailVerificationTokenExpires: expires,
  });

  const user = userData.toObject();
   user.password = "";

  // Cache user in Redis
  await redis.hset(`user:${userData._id}`, { user: JSON.stringify(user) });

  const accessToken = generateAccessToken({ id: userData._id });
  const refreshToken = generateRefreshToken({ id: userData._id });
  sendJwtTokensInCookies(res, accessToken, refreshToken);

  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  try {
    await sendVerificationEmail(user.email, token, link);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return res.status(500).json({
      message:
        "User registered, but failed to send verification email. Please try resending the verification email.",
    });
  }

  return res.status(201).json({ message: "User registered successfully", user, success: true });
});

// Login controller
export const Login = TryCatch(async (req: Request, res: Response) => {
  const result = loginValidator.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({
      errors: result.error.issues.map((err: z.ZodIssue) => ({
        field: err.path[0],
        message: err.message,
      })),
    });

  const { email, password } = result.data;

  // Check Redis cache first
  let user: IUser | null = null;
  const keys = await redis.keys("user:*");
  for (const key of keys) {
    const cached = await redis.hgetall(key);
    if (cached?.user && JSON.parse(cached.user).email === email) {
      user = JSON.parse(cached.user);
      break;
    }
  }

  // If not in Redis, query DB
  let userDataObj = null;
  if (!user) {
    userDataObj = await UserModel.findOne({ email });
    if (!userDataObj) return res.status(400).json({ message: "You are not registered, please signup" });
    user = userDataObj.toObject();
    user.password = "";
    await redis.hset(`user:${userDataObj._id}`, { user: JSON.stringify(user) });
  } else {
    userDataObj = await UserModel.findOne({ email }); // for password check
  }

  const isPasswordValid = await bcrypt.compare(password, userDataObj!.password);
  if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken({ id: userDataObj!._id });
  const refreshToken = generateRefreshToken({ id: userDataObj!._id });
  sendJwtTokensInCookies(res, accessToken, refreshToken);

  return res.status(200).json({ message: "Login successful", user, success: true });
});

// Google OAuth callback
export const googleCallback = TryCatch(async (req: Request, res: Response) => {
  const userObj = req.user as any;
  const user = userObj.user;

  // Cache in Redis
  await redis.hset(`user:${user._id}`, { user: JSON.stringify(user) });

  sendJwtTokensInCookies(res, userObj.accessToken, userObj.refreshToken);
  const redirectUrl = `${process.env.FRONTEND_URL}/auth-success?googleLogin=true`;
  return res.redirect(redirectUrl);
});

// Verify email
export const verifyEmail = TryCatch(async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token is required", success: false });

  const user = await UserModel.findOne({
    emailVerificationToken: token,
    emailVerificationTokenExpires: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token", success: false });

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationTokenExpires = null;
  await user.save();

  // Update Redis cache
  const cached = await redis.hgetall(`user:${user._id}`);
  if (cached?.user) {
    const updatedUser = JSON.parse(cached.user);
    updatedUser.isEmailVerified = true;
    await redis.hset(`user:${user._id}`, { user: JSON.stringify(updatedUser) });
  }

  return res.status(200).json({ message: "Email verified successfully", success: true, user });
});

// Resend verification email
export const resendVerificationEmail = TryCatch(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required", success: false });

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found", success: false });
  if (user.isEmailVerified) return res.status(400).json({ message: "Email already verified", success: false });

  const { token, expires } = generateVerificationToken(6);
  expires.setMinutes(expires.getMinutes() + 10);

  user.emailVerificationToken = token;
  user.emailVerificationTokenExpires = expires;
  await user.save();

  // Update Redis cache
  const cached = await redis.hgetall(`user:${user._id}`);
  if (cached?.user) {
    const updatedUser = JSON.parse(cached.user);
    updatedUser.emailVerificationToken = token;
    updatedUser.emailVerificationTokenExpires = expires;
    await redis.hset(`user:${user._id}`, { user: JSON.stringify(updatedUser) });
  }

  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  try {
    await sendVerificationEmail(user.email, token, link);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send verification email" });
  }

  return res.status(200).json({ message: "Verification email sent", success: true });
});

// Logout
export const logoutUser = TryCatch(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  res.clearCookie("isLoggedIn", refreshCookieOptions);
  res.clearCookie("accessToken", accessCookieOptions);
  res.clearCookie("refreshToken", refreshCookieOptions);

  // Remove user from Redis cache
  await redis.del(`user:${user._id}`);

  return res.status(200).json({ success: true, message: "Logged out successfully" });
});
