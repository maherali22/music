import Song from "../models/schema/songSchema.js";
import CustomError from "../utils/customError.js";
import { songValidation } from "../models/joichema/joischema.js";

//1. add songs to the database

const addSongs = async (req, res, next) => {
  const { error, value } = songValidation.validate(req.body);

  if (error) {
    return next(new CustomError(error.message, 400));
  }
  const { title, artist, album, genre, duration } = value;

  const audioFileUrl = req.files?.audioFile[0].path;
  const imageFileUrl = req.files?.imageFile[0].path;

  const newSong = new Song({
    title,
    artist,
    album,
    genre,
    duration,
    fileUrl: audioFileUrl,
    image: imageFileUrl,
  });

  await newSong.save();

  res.status(200).json({
    success: true,
    message: "Song added successfully",
    data: newSong,
  });
};

//2. edit songs in the database

const editSongs = async (req, res, next) => {
  const { error, value } = songValidation.validate(req.body);

  if (error) {
    return next(new CustomError(error.message, 400));
  }
  const updatedDb = { ...value };
  console.log(updatedDb);

  if (res.files?.imageFile[0]?.path) {
    updatedDb.imageFile = res.files?.imageFile[0]?.path;
  } else if (!value.imageFile) {
    delete updatedDb.imageFile;
  }

  if (res.files?.audioFile[0]?.path) {
    updatedDb.audioFile = res.files?.audioFile[0]?.path;
  } else if (!value.audioFile) {
    delete updatedDb.audioFile;
  }

  const updatedSong = await Song.findByIdAndUpdate(req.params.id, updatedDb, {
    new: true,
    runValidators: true,
  });
  if (!updatedSong) {
    return next(new CustomError("Song not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Song updated successfully",
    data: updatedSong,
  });
};

//3. delete songs from the database

const deleteSongs = async (req, res, next) => {
  const song = await Song.findByIdAndDelete(req.params.id);
  if (!song) {
    return next(new CustomError("Song not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Song deleted successfully",
    data: song,
  });
};

//4. get all songs from the database

const getAllSongs = async (req, res, next) => {
  const songs = await Song.find();
  res.status(200).json({
    success: true,
    message: "Songs fetched successfully",
    data: songs,
  });
};

export { addSongs, editSongs, deleteSongs , getAllSongs };
