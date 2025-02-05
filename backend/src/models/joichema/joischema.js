import joi from "joi";

const userValidation = joi.object({
  name: joi.string().min(3).max(20).required(),
  email: joi.string().email().optional(),
  password: joi.string().min(6).max(20).optional(),
  confirmPassword: joi.string().valid(joi.ref("password")).optional(),
  profilePic: joi.string().allow("", null),
  block: joi.boolean().default(false),
  admin: joi.boolean().default(false),
});

const loginValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(20).required(),
});

const songValidation = joi.object({
  title: joi.string().optional(),
  artist: joi.string().optional(),
  album: joi.string().optional(),
  duration: joi.number().min(1),
  genre: joi.string().optional(),
  image: joi.string().allow("", null).optional(),
  images: joi.string().allow("", null).optional(),
  audio: joi.string().allow("", null).optional(),
  fileUrl: joi.string().allow("", null).optional(),
});

export { userValidation, loginValidation, songValidation };
