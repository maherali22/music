import CustomError from "../utils/customError.js";
import Song from "../models/schema/songSchema.js";

//1. get all songs

const getAllSongs = async (req, res, next) => {
  const songs = await Song.find();

  if (!songs || songs.length === 0) {
    return next(new CustomError("Songs not found", 404));
  }

  const formattedSongs = songs.map((song) => {
    const min = Math.floor(song.duration / 60);
    const sec = song.duration % 60;
    const formattedDuration = `${min}:${sec < 10 ? "0" : ""}${sec}`;

    return {
      // _id: song._id,
      // title: song.title,
      // artist: song.artist,
      // duration: formattedDuration,
      // imageFile: song.imageFile,
      // audioFile: song.audioFile,
      // album: song.album,

      ...song.toObject(),
      duration: formattedDuration,
    };
  });

  res.status(200).json({
    success: true,
    message: "Songs fetched successfully",
    data: formattedSongs,
  });
};

//2. get songs by id

const getSongById = async (req, res, next) => {
  const { id } = req.params;
  const song = await Song.findById(id);

  if (!song) {
    return next(new CustomError("Song not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Song fetched successfully",
    data: song,
  });
};

export { getAllSongs, getSongById };
