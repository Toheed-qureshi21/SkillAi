import { Response } from "express";
import { accessCookieOptions, refreshCookieOptions } from "../constant/constants.js";

export const sendJwtTokensInCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, accessCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.cookie("isLoggedIn",true,refreshCookieOptions); // its expiry is same as refresh token 
};
