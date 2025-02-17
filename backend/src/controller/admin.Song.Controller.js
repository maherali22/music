import Song from "../models/schema/songSchema.js";
import CustomError from "../utils/customError.js";
import { songValidation } from "../models/joichema/joischema.js";

// 1. Add songs to the database
const addSongs = async (req, res, next) => {
  try {
    const { error, value } = songValidation.validate(req.body);
    if (error) {
      return next(new CustomError(error.message, 400));
    }

    const { title, artist, album, genre, duration } = value;
    const audioFileUrl = req.files?.audioFile?.[0]?.path;
    const imageFileUrl = req.files?.imageFile?.[0]?.path;

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
  } catch (err) {
    next(err);
  }
};

// 2. Edit songs in the database
const editSongs = async (req, res, next) => {
  try {
    const { error, value } = songValidation.validate(req.body);
    if (error) {
      return next(new CustomError(error.message, 400));
    }

    // Start with the validated data
    const updatedData = { ...value };
    console.log(updatedData);

    // Update image if a new file is provided
    if (req.files?.imageFile && req.files.imageFile.length > 0) {
      updatedData.image = req.files.imageFile[0].path;
    }
    // Update audio file if a new file is provided
    if (req.files?.audioFile && req.files.audioFile.length > 0) {
      updatedData.fileUrl = req.files.audioFile[0].path;
    }

    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSong) {
      return next(new CustomError("Song not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Song updated successfully",
      data: updatedSong,
    });
  } catch (err) {
    next(err);
  }
};

// 3. Delete songs from the database
const deleteSongs = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return next(new CustomError("Song not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Song deleted successfully",
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// 4. Get all songs from the database
const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find();
    res.status(200).json({
      success: true,
      message: "Songs fetched successfully",
      data: songs,
    });
  } catch (err) {
    next(err);
  }
};

export { addSongs, editSongs, deleteSongs, getAllSongs };
