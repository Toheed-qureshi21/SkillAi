import { NextFunction, Request, Response } from "express";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { fetchUserProfile } from "../services/user.service.js";
import { sendJwtTokensInCookies } from "../utils/cookies.js";


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    let userId: string | null = null;
    let shouldRefresh = false;

    if (accessToken) {
      try {
        const { id } = verifyAccessToken(accessToken) as { id: string };
        userId = id;
      } catch (error) {
        const { id } = verifyRefreshToken(refreshToken) as { id: string };
        userId = id;
        shouldRefresh = true;
      }
    } else {
      const { id } = verifyRefreshToken(refreshToken) as { id: string };
      userId = id;
      shouldRefresh = true;
    }

    const user = await fetchUserProfile(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (shouldRefresh) {
      const newAccessToken = generateAccessToken({ id: user._id.toString() });
      sendJwtTokensInCookies(res, newAccessToken, refreshToken);
    }

    (req as any).user = user;
    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
};
