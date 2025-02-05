import {
  userValidation,
  loginValidation,
} from "../models/joichema/joischema.js";
import User from "../models/schema/userSchema.js";
import CustomError from "../utils/customError.js";
import sendEmail from "../utils/emailService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//1.user registration

const userRegistration = async (req, res, next) => {
  const { value, error } = userValidation.validate(req.body);
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return next(new CustomError(error.details[0].message, 400));
  }
  const { name, email, password, confirmPassword } = value;

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new CustomError("Passwords do not match", 400));
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 6);

  // Generate OTP
  const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
  // console.log("Generated OTP:", otp);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    otp,
    isVerified: false,
  });
  // Save the new user
  await newUser.save();

  const emailTemplate = `
   <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; text-align: center; color: #333;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #2d89ef; margin-bottom: 20px;">Welcome to Our Platform, ${name}!</h2>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Thank you for joining us! To complete your registration, please verify your email by entering the OTP code below:
    </p>
    <div style="background-color: #f1f5fc; padding: 10px; border-radius: 5px; display: inline-block; margin-bottom: 20px;">
      <h1 style="color: #2d89ef; font-size: 36px; letter-spacing: 2px;">${otp}</h1>
    </div>
    <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
      If you did not sign up for this account, please ignore this email.
    </p>
    <p style="font-size: 12px; color: #aaa;">
      Need help? Contact our support team at <a href="mailto:support@example.com" style="color: #2d89ef;">support@example.com</a>.
    </p>
  </div>
  <p style="font-size: 12px; color: #aaa; margin-top: 20px;">
    &copy; ${new Date().getFullYear()} Our Platform. All rights reserved.
  </p>
</div>

 `;
  // Send the OTP email
  await sendEmail(email, "Verify Your Email with OTP", emailTemplate);

  // Send success response
  res.status(200).json({
    errorcode: 0,
    status: true,
    msg: "User registered successfully. Please check your email for the OTP.",
    newUser,
  });
};

//2.opt verification with email

const verifyOtp = async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return next(new CustomError("OTP is required", 400));
  }

  console.log("Received OTP:", otp);

  // Find user with the provided OTP
  const user = await User.findOne({ otp });
  if (!user) {
    console.log("No user found with this OTP");
    return next(new CustomError("Invalid OTP or User not found", 404));
  }

  // Update user verification status
  user.isVerified = true;
  user.otp = null;

  // Save the updated user
  await user.save();

  console.log(`User ${user.email} verified successfully.`);

  // Send success response
  res.status(200).json({
    errorcode: 0,
    status: true,
    msg: "Email verified successfully. Your account is now active.",
  });
};

//3.user login

const userLogin = async (req, res, next) => {
  const { value, error } = loginValidation.validate(req.body);

  // Validate request body
  if (error) {
    console.log("Validation error:", error.message);
    return next(new CustomError(error.message, 400));
  }

  const { email, password } = value;
  console.log("Login attempt for email:", email);

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    console.log("User not found for email:", email);
    return next(new CustomError("User not found", 404));
  }
  console.log("User found:", user);

  // Check if the user is blocked
  if (user.blocked) {
    console.log("Blocked user attempted login:", email);
    return next(
      new CustomError("Your account has been blocked", 403)
    );
  }

  // Check if the password is correct
  const isPasswordMatching = await bcrypt.compare(password, user.password);
  console.log("Password match status:", isPasswordMatching);
  if (!isPasswordMatching) {
    return next(new CustomError("Invalid email or password", 401));
  }

  // Check if user is verified
  if (!user.isVerified) {
    return next(
      new CustomError(
        "User account is not verified. Please verify your email.",
        403
      )
    );
  }

  // Generate access and refresh tokens
  const payload = { id: user._id, username: user.name, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "7d" });
  const refreshmentToken = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "7d",
  });
  console.log("Tokens generated successfully.");

  // Set cookies with tokens
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "none",
  });
  res.cookie("refreshmentToken", refreshmentToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "none",
  });

  // Respond with user details and tokens
  res.status(200).json({
    message: "Login successful",
    data: {
      user: user.name,
      profilePicture: user.profilePic,
      token,
      refreshmentToken,
    },
  });
};
//4. current user
const getCurrentUser = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id).select("-password");
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  res.status(200).json({
    errorcode: 0,
    status: true,
    user,
  });
};

//5.user logout

const userLogout = async (req, res, next) => {
  // Clear cookies
  res.clearCookie("token");
  res.clearCookie("refreshmentToken");

  // Send success response
  res.status(200).json({
    message: "Logout successful",
  });
};

//6.edit user profile

const editUserProfile = async (req, res, next) => {
  console.log("Received request to edit user profile");
  console.log("Request fields:", req.files);
  const { error, value } = userValidation.validate(req.body);
  const { name } = value;
  const id = req.user.id;
  if (error) {
    console.log("Validation error:", error.details[0].message);
    return next(new CustomError(error.details[0].message, 400));
  }

  const updatedFields = {};

  if (name) {
    updatedFields.name = name;
  }

  if (req.files && req.files.profilePic) {
    updatedFields.profilePic = req.files.profilePic[0]?.path;
  }

  const user = await User.findByIdAndUpdate(id, updatedFields, { new: true });
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  res.status(200).json({
    errorcode: 0,
    status: true,
    msg: "User profile updated successfully",
    user,
  });
};
export {
  userRegistration,
  verifyOtp,
  userLogin,
  getCurrentUser,
  userLogout,
  editUserProfile,
};
