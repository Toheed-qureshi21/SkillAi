import express from "express";
import { Login, signup, verfiyEmail } from "../../controllers/auth/auth.controller";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",Login);
router.post("/verify-email",verfiyEmail)

export default router;