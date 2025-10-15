import { NextFunction, Request, Response } from "express";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { fetchUserProfile } from "../services/user.service.js";
import { sendJwtTokensInCookies } from "../utils/cookies.js";
import { accessCookieOptions, refreshCookieOptions } from "../constant/constants.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    console.log("Cookies received:", { accessToken, refreshToken });

    if (!refreshToken) {
      console.log("No refresh token found");
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    let userId: string | null = null;
    let shouldRefresh = false;

    if (accessToken) {
      try {
        const { id } = verifyAccessToken(accessToken) as { id: string };
        userId = id;
        console.log("Access token verified, userId:", userId);
      } catch (error) {
        console.log("Access token invalid, falling back to refresh token:", error);
        const { id } = verifyRefreshToken(refreshToken) as { id: string };
        userId = id;
        shouldRefresh = true;
      }
    } else {
      console.log("No access token, using refresh token");
      const { id } = verifyRefreshToken(refreshToken) as { id: string };
      userId = id;
      shouldRefresh = true;
    }

    console.log("User ID:", userId, "Should refresh:", shouldRefresh);

    const user = await fetchUserProfile(userId);
    console.log("Fetched user:", user);
    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (shouldRefresh) {
      const newAccessToken = generateAccessToken({ id: user._id.toString() });
      console.log("Generated new access token:", newAccessToken);
      sendJwtTokensInCookies(res, newAccessToken, refreshToken);
      console.log("Cookies set with options:", { accessCookieOptions, refreshCookieOptions });
      console.log("Response headers:", res.getHeaders());
    }

    (req as any).user = user;
    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
};
