import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import userRoute from "./routes/userRoute.js";
dotenv.config();
import authRoute from "./routes/authRoute.js";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const app = express();
app.use(express.json());
app.use((err,req,res,next)=>{
  const statusCode = err.statusCode ||500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success:false,
    statusCode,
    message,
  })
})

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.listen(3000, () => {
  console.log("Server running at PORT 3000");
});
