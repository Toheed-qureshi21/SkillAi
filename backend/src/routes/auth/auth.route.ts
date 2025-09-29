import express from "express";
import {
  Login,
  signup,
  verifyEmail,
} from "../../controllers/auth/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", Login);
router.post("/verify-email", verifyEmail);
export default router;
