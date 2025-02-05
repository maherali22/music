import User from "../models/schema/userSchema.js";
import CustomError from "../utils/customError.js";
import { loginValidation } from "../models/joichema/joischema.js";

//1. get all users

const getAllUsers = async (req, res, next) => {
  const users = await User.find().populate("likedSongs");
  res.status(200).json(users);

  if (!users) {
    return next(new CustomError("No users found", 404));
  }
  console.log(users);
};

//2. block user

const blockUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  if (user.blocked === false) {
    user.blocked = true;
    await user.save();
    res.status(200).json({ message: "User blocked" });
  } else {
    user.blocked = false;
    await user.save();
    res.status(200).json({ message: "User unblocked" });
  }
};

export { getAllUsers, blockUser };
