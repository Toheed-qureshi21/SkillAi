import { config } from "dotenv";
import { CookieOptions } from "express";

config();

export const accessCookieOptions:CookieOptions = {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge:15* 60 * 1000, // 15 minutes
}
export const refreshCookieOptions:CookieOptions = {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

};
