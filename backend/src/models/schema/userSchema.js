import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes unnecessary spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Ensures email is stored in lowercase
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      required: false,
      default: false,
    },
    profilePic: {
      type: String,
      default:
        "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
    },
    blocked: {
      type: Boolean,
      required: false,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    likedSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
