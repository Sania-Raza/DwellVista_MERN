import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dns from "dns";
import cors from "cors";

import userRoutes from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import listingRoutes from "./routes/listingRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// Middleware
app.use(
  cors({
    origin: https://dwell-vistaa.vercel.app,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoutes);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DwellVista API is running!",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

export default app;
