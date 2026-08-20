import express from "express";
import User from "../models/userModel.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import { test, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../utlis/verifyUser.js";

const router = express.Router();
router.get("/test", test);

router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "estate-mern/avatars",
      },
    );

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Image upload failed",
    });
  }
});

router.post("/update-avatar", async (req, res, next) => {
  try {
    const { userId, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { returnDocument: "after" },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Avatar updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/update/:id',verifyToken ,updateUser)

export default router;
