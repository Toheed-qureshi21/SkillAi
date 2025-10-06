import { Response } from "express";
import { cookieOptions } from "../constant/constants.js";

export const sendJwtTokensInCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);
};
