import crypto from "crypto";
import { UserModel } from "../models/User.schema.js";
import { Response } from "express";

export const generateVerificationToken = (digit = 6) => {
  const min = 10 ** (digit - 1);
  const max = 10 ** digit;
  const token = crypto.randomInt(min, max).toString();
  const expires = new Date(Date.now() + 120 * 1000);
  return { token, expires };
};

export const fetchUserProfile = async (id: string) => {
  const user = await UserModel.findById(id).select("-password");
  return user;
};
