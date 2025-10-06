import { NextFunction, Request, Response } from "express";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { fetchUserProfile } from "../services/user.service.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    if (accessToken) {
      const { id } = verifyAccessToken(accessToken) as { id: string };
      const user = await fetchUserProfile(id);
      if (!user || (user as any)._id === undefined) {
        return res
          .status(401)
          .json({ message: "Unauthorized", success: false });
      }
      req.user = user;
      next();
      return;
    }
    const { id } = verifyRefreshToken(refreshToken) as { id: string };
    const user = await fetchUserProfile(id);

    if (!user || (user as any)._id === undefined) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const newAccessToken = generateAccessToken({ id: (user as any)._id });
    req.user = user;
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    next();
    return;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
};
