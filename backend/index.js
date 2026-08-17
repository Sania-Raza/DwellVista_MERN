import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import userRoute from "./routes/userRoute.js";
dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const app = express();
app.use("/api/user", userRoute);

app.listen(3000, () => {
  console.log("Server running at PORT 3000");
});
