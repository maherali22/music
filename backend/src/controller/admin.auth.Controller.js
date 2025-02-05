import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";
import { loginValidation } from "../models/joichema/joischema.js";

// admin login
const adminLogin = async (req, res, next) => {
  const { error, value } = loginValidation.validate(req.body);
  if (error) {
    return next(new CustomError("admin not found", 400));
  }
  const { email, password } = value;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    console.log("admin logged in successfully");
    const token = jwt.sign(
      { id: "admin", isAdmin: true },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );
    const refreshmentToken = jwt.sign(
      { id: "admin", isAdmin: true },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });
    res.cookie("refreshmentToken", refreshmentToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });
    res.status(200).json({
      success: true,
      message: "admin logged in successfully",
      token,
    });
  } else {
    return next(new CustomError("admin not found", 400));
  }
};

// admin logout
const adminLogout = async (req, res, next) => {
  res.clearCookie("token");
  res.clearCookie("refreshmentToken");
  res.status(200).json({
    success: true,
    message: "admin logged out successfully",
  });
};
export { adminLogin , adminLogout};
