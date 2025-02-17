import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";
import { loginValidation } from "../models/joichema/joischema.js";

// admin login
const adminLogin = async (req, res, next) => {
  const { error, value } = loginValidation.validate(req.body);
  if (error) {
    return next(new CustomError("Invalid input format", 400));
  }

  const { email, password } = value;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
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
      message: "Admin logged in successfully",
      token,
      refreshmentToken,
      adminName: "admin",
      isAdmin: true,
    });
  } else {
    return next(new CustomError("Invalid email or password", 401));
  }
};

// admin logout
const adminLogout = async (req, res, next) => {
  res.clearCookie("token");
  res.clearCookie("refreshmentToken");
  res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};

export { adminLogin, adminLogout };
