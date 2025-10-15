import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { TryCatch } from "../../utils/TryCatch.js";
import {
  loginValidator,
  SignupInput,
  signupValidator,
} from "../../validators/auth.validator.js";
import { UserModel } from "../../models/User.schema.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { sendJwtTokensInCookies } from "../../utils/cookies.js";
import { sendVerificationEmail } from "../../utils/sendEmail.js";
import { generateVerificationToken } from "../../services/user.service.js";
import { z } from "zod";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../constant/constants.js";

// Signup controller
export const signup = TryCatch(async (req: Request, res: Response) => {
  const result = signupValidator.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      errors: result?.error?.issues?.map((err: z.ZodIssue) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
  const { name, email, password }: SignupInput = result.data;
  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    return res
      .status(400)
      .json({ message: "You are already registered, please login" });
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

  const user = userData.toObject() as { email: string; password?: string };
  delete user.password;

  const accessToken = generateAccessToken({ id: userData._id });
  const refreshToken = generateRefreshToken({ id: userData._id });
  sendJwtTokensInCookies(res, accessToken, refreshToken);

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

  return res
    .status(201)
    .json({ message: "User registered successfully", user, success: true });
});

// Login controller
export const Login = TryCatch(async (req: Request, res: Response) => {
  const result = loginValidator.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      errors: result?.error?.issues?.map((err: z.ZodIssue) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
  const { email, password } = result.data;
  const userData = await UserModel.findOne({ email });
  if (!userData) {
    return res
      .status(400)
      .json({ message: "You are not registered, please signup" });
  }
  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const user = userData.toObject() as { password?: string };
  delete user.password;

  const accessToken = generateAccessToken({ id: userData._id });
  const refreshToken = generateRefreshToken({ id: userData._id });

  sendJwtTokensInCookies(res, accessToken, refreshToken);
  return res
    .status(201)
    .json({ message: "Login successful", user, success: true });
});
export const googleCallback = (req: Request, res: Response) => {
  const userObj = req.user as any;
  const user = userObj.user;
  sendJwtTokensInCookies(res, userObj.accessToken, userObj.refreshToken);

  // redirect to auth-success page
  const redirectUrl = `${process.env.FRONTEND_URL}/auth-success?googleLogin=true`;
  return res.redirect(redirectUrl);
};

export const verifyEmail = TryCatch(async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ message: "Token is required", success: false });
  }

  const user = await UserModel.findOne({
    emailVerificationToken: token,
    emailVerificationTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid or expired token", success: false });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null; // OK if schema is optional
  user.emailVerificationTokenExpires = null; // OK if schema is optional

  await user.save();
  return res
    .status(201)
    .json({ message: "Email verified successfully", success: true, user });
});

export const resendVerificationEmail = TryCatch(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Email is already verified", success: false });
    }

    // Generate a new token and expiration
    const { token, expires } = generateVerificationToken(6);
    expires.setMinutes(expires.getMinutes() + 10); // token valid for 10 min

    user.emailVerificationToken = token;
    user.emailVerificationTokenExpires = expires;

    await user.save();

    // Send email
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    try {
      await sendVerificationEmail(user.email, token, link);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again later.",
      });
    }
    return res
      .status(200)
      .json({ message: "Verification email sent", success: true });
  }
);

export const logoutUser = TryCatch(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.clearCookie("isLoggedIn", refreshCookieOptions);
  res.clearCookie("accessToken", accessCookieOptions);
  res.clearCookie("refreshToken", refreshCookieOptions);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
