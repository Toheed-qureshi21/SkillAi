import express from "express";
import {
  googleCallback,
  Login,
  logoutUser,
  resendVerificationEmail,
  signup,
  verifyEmail,
} from "../../controllers/auth/auth.controller.js";
import passport from "passport";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", Login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

router.post("/verify-email", verifyEmail);

router.post("/resend-verification-email", resendVerificationEmail);


router.post("/logout",authMiddleware,logoutUser)
export default router;
