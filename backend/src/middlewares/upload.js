import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Cloudinary credentials are missing from the environment variables."
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "audios",
    resource_type: "auto",
    allow_formats: ["mp3", "wav", "m4a", "aac", "flac"],
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images",
    resource_type: "auto",
    allow_formats: ["jpg", "jpeg", "png", "webp", "svg"],
  },
});

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      if (file.fieldname === "audioFile") {
        return {
          folder: "audios",
          resource_type: "auto",
          allowed_formats: ["mp3", "wav", "ogg", "m4a", "aac", "flac"],
        };
      }
      if (file.fieldname === "imageFile") {
        return {
          folder: "images",
          resource_type: "auto",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
        };
      }
    },
  }),
}).fields([
  { name: "audioFile", maxCount: 1 },
  { name: "imageFile", maxCount: 1 },
  { name: "profilePic", maxCount: 1 },
]);

export default upload;
