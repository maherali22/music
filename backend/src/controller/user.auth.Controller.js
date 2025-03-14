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
  <div style="font-family: Circular, Helvetica, Arial, sans-serif; background-color: #000000; padding: 40px 20px; text-align: center; color: #FFFFFF;">
  <div style="max-width: 600px; margin: auto; background: #121212; padding: 40px 20px; border-radius: 8px;">
    <!-- Spotify Logo -->
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Spotify_New_Full_Logo_RGB_Green.png" 
         alt="Spotify" 
         style="width: 180px; margin-bottom: 40px;"
    />
    
    <h2 style="color: #FFFFFF; margin-bottom: 24px; font-size: 32px; font-weight: bold;">
      Verify your email
    </h2>
    
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 32px; color: #B3B3B3;">
      Hi ${name}, enter this verification code in the app to verify your email address and start enjoying Spotify:
    </p>
    
    <div style="background-color: #282828; padding: 24px; border-radius: 8px; display: inline-block; margin-bottom: 32px;">
      <h1 style="color: #1DB954; font-size: 40px; letter-spacing: 8px; margin: 0; font-weight: bold;">
        ${otp}
      </h1>
    </div>
    
    <p style="font-size: 14px; color: #B3B3B3; margin-bottom: 24px; line-height: 1.5;">
      This code will expire in 30 minutes. If you didn't request this email, you can safely ignore it.
    </p>
    
    <div style="border-top: 1px solid #282828; padding-top: 24px; margin-top: 32px;">
      <p style="font-size: 14px; color: #B3B3B3; margin-bottom: 16px;">
        Need help? Visit <a href="https://support.spotify.com" style="color: #1DB954; text-decoration: none;">Spotify Support</a>
      </p>
      
      <p style="font-size: 12px; color: #6A6A6A; line-height: 1.5;">
        This email was sent to you by Spotify. To learn more about how Spotify processes personal data, please visit our <a href="https://www.spotify.com/privacy" style="color: #1DB954; text-decoration: none;">Privacy Policy</a>.
      </p>
    </div>
  </div>
  
  <div style="margin-top: 24px; color: #6A6A6A; font-size: 12px;">
    Spotify AB, Regeringsgatan 19, 111 53, Stockholm, Sweden
  </div>
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
    return next(new CustomError("Your account has been blocked", 403));
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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        admin: user.admin,
        isVerified: user.isVerified,
        likedSongs: user.likedSongs,
        blocked: user.blocked,
      },
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

  const user = await User.findByIdAndUpdate(id, updatedFields, {
    new: true,
    select: "-password -otp -__v", // Exclude sensitive fields
  });

  res.status(200).json({
    errorcode: 0,
    status: true,
    msg: "User profile updated successfully",
    data: {
      name: user.name,
      profilePicture: user.profilePic,
      email: user.email,
      _id: user._id,
      admin: user.admin,
      isVerified: user.isVerified,
    },
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
