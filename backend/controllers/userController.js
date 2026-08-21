import User from "../models/userModel.js";
import { errorHandler } from "../utlis/error.js";
import bcryptjs from "bcryptjs";
export const test = (req, res) => {
  res.json({
    message: "just testing controller just created",
  });
};

export const updateUser = async (req, res, next) => {
  console.log("JWT USER ID:", req.user.id);
  console.log("PARAM ID:", req.params.id);

  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Forbidden"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { returnDocument: "after" },
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async(req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401,"You can only delete your own Account!!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error)
  }
};
