import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getUserProfile } from "../../controllers/user/user.controller.js";
import { onboardUserToCompleteProfile } from "../../controllers/user/user.controller.js";

const router = express.Router();

router.get("/me",authMiddleware,getUserProfile);

// onboard user api
router.post("/onboard",authMiddleware,onboardUserToCompleteProfile);

export default router;