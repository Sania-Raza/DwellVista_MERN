import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dns from "dns";
import userRoutes from "./routes/userRoute.js";
import cors from "cors";
import listingRoutes from "./routes/listingRoutes.js";


import authRoute from "./routes/authRoute.js";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientPath = path.join(__dirname, "../client/dist");


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoute);
app.use("/api/listing",listingRoutes);
app.use(express.static(clientPath));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(3000, () => {
  console.log("Server running at PORT 3000");
});
