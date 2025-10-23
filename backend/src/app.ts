import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDb } from "./lib/db.js";
import authRouter from "./routes/auth/auth.route.js";
import userRoutes from "./routes/user/user.route.js";
import industryInsightsRoutes from "./routes/industryInsights/industryInsights.route.js"

import passport from "passport";

import "./lib/passport.js";

dotenv.config();
connectDb();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// 🔹 Rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/auth", authRouter); // full path: /api/auth/signup, /api/auth/login

app.use("/api/user", userRoutes); // full path :/api/user/me

app.use("/api/industry-insights",industryInsightsRoutes); //full paht :/api/industry-insights/*

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
