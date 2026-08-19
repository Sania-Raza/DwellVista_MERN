import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://images.icon-icons.com/3446/PNG/512/profile_user_avatar_people_icon_219228.png",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("user", userSchema);

export default User;
