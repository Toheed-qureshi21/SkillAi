import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { TryCatch } from "../../utils/TryCatch";
import {
  loginValidator,
  SignupInput,
  signupValidator,
} from "../../validators/auth.validator";
import { UserModel } from "../../models/User.schema";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { sendJwtTokensInCookies } from "../../utils/cookies";
import { sendVerificationEmail } from "../../utils/sendEmail";
import { generateVerificationToken } from "../../services/user.service";
import { success } from "zod";

// Signup controller
  export const signup = TryCatch(async (req: Request, res: Response) => {
    const result = signupValidator.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        errors: result?.error?.issues?.map((err) => ({
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
      emailVerficationToken: token,
      emailVerificationTokenExpires: expires,
    });

    const user = userData.toObject() as { email: string; password?: string };
    delete user.password;

    const accessToken = generateAccessToken({ id: userData._id });
    const refreshToken = generateRefreshToken({ id: userData._id });

    sendJwtTokensInCookies(res, accessToken, refreshToken);
    
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await sendVerificationEmail(user.email, token, link).catch(console.error);
    return res
      .status(201)
      .json({ message: "User registered successfully", user, success: true });
  });

// Login controller
export const Login = TryCatch(async (req: Request, res: Response) => {
  const result = loginValidator.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      errors: result?.error?.issues?.map((err) => ({
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
    .status(200)
    .json({ message: "Login successful", user, success: true });
});
export const verifyEmail = TryCatch(async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token is required", success: false });
  }

  const user = await UserModel.findOne({
    emailVerificationToken: token,
    emailVerificationTokenExpires: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token", success: false });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null; // OK if schema is optional
  user.emailVerificationTokenExpires = null; // OK if schema is optional

  await user.save();
  return res.status(200).json({ message: "Email verified successfully", success: true });
});
