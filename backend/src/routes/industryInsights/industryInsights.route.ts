import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getIndustryInsights } from "../../controllers/industryInsights/industryInsights.controller.js";

const router = express.Router();

router.get("/",authMiddleware,getIndustryInsights);

export default router;