import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
dotenv.config();
import authRoute from "./routes/authRoute.js";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

  const app= express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());


app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(3000, () => {
  console.log("Server running at PORT 3000");
});
