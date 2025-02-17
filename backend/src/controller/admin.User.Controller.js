import User from "../models/schema/userSchema.js";
import CustomError from "../utils/customError.js";

// 1. Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("likedSongs");
    if (!users || users.length === 0) {
      return next(new CustomError("No users found", 404));
    }
    console.log(users);
    // Wrap users in a data object for consistency with the Redux slice
    res.status(200).json({ data: users });
  } catch (error) {
    return next(error);
  }
};

// 2. Block/Unblock user
const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Use findById to retrieve the user before updating
    const user = await User.findById(id);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    // Toggle the blocked status
    user.blocked = !user.blocked;
    await user.save();
    res.status(200).json({
      message: user.blocked ? "User blocked" : "User unblocked",
    });
  } catch (error) {
    return next(error);
  }
};

export { getAllUsers, blockUser };
