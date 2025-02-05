import CustomError from "../utils/customError.js";
import User from "../models/schema/userSchema.js";
import Song from "../models/schema/songSchema.js";

//1. add to liked songs

const addToLikedSongs = async (req, res, next) => {
  const id = req.params.id;
  const { songId } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  if (user) {
    const favSong = user.likedSongs.find((song) => song == songId);
    if (favSong) {
      return next(new CustomError("Song already exists in liked songs", 400));
    } else {
      user.likedSongs.push(songId);
      await user.save();
      res.status(200).json({
        success: true,
        message: "Song added to liked songs",
        data: user.likedSongs,
      });
    }
  } else {
    const newLikedSong = new User({
      user: req.user.id,
      likedSongs: [songId],
    });
    await newLikedSong.save();
    res.status(200).json({
      success: true,
      message: "Song added to liked songs",
      data: newLikedSong,
    });
  }
};

//2.get liked songs

const getLikedSongs = async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id).populate("likedSongs");
  if (!user) {
    return next(new CustomError("liked songs not found", 404));
  }

  const formattedSongs = user.likedSongs.map((song) => {
    const min = Math.floor(song.duration / 60);
    const sec = song.duration % 60;
    const formattedDuration = `${min}:${sec < 10 ? "0" : ""}${sec}`;

    return {
      ...song.toObject(),
      duration: formattedDuration,
    };
  });
  if (formattedSongs.length === 0) {
    return next(new CustomError("liked songs not found", 400));
  }
  res.status(200).json({
    success: true,
    message: "liked songs fetched successfully",
    data: formattedSongs,
  });
};

//3. remove from liked songs

const removeFromLikedSongs = async (req, res, next) => {
  const id = req.user.id;
  const { songId } = req.body;
  const data = await User.findById(id);
  if (!data) {
    return next(new CustomError("songs not found", 404));
  }
  data.likedSongs = data.likedSongs.filter((song) => song != songId);
  await data.save();
  res.status(200).json({
    success: true,
    message: "song removed from liked songs",
    data: data.likedSongs,
  });
};

// Albums

// get albums
const getAlbum = async (req, res, next) => {
  const songs = await Song.aggregate([
    {
      $group: {
        _id: "$album",
        songs: { $push: "$$ROOT" },
      },
    },
  ]);

  if (!songs || songs.length === 0) {
    return next(new CustomError("Albums not found", 404));
  }

  const formattedOutput = songs.map((album) => ({
    _id: album._id,
    songs: album.songs.map((song) => ({
      ...song,
      duration: `${Math.floor(song.duration / 60)}:${song.duration % 60}`,
    })),
  }));

  res.status(200).json({
    success: true,
    message: "Albums fetched successfully",
    data: formattedOutput,
  });
};

// Artists

const getArtist = async (req, res, next) => {
  const songs = await Song.aggregate([
    {
      $group: {
        _id: "$artist",
        songs: { $push: "$$ROOT" },
      },
    },
  ]);

  if (!songs || songs.length === 0) {
    return next(new CustomError("Artists not found", 404));
  }

  const formattedOutput = songs.map((artist) => ({
    _id: artist._id,
    songs: artist.songs.map((song) => ({
      ...song,
      duration: `${Math.floor(song.duration / 60)}:${song.duration % 60}`,
    })),
  }));

  res.status(200).json({
    success: true,
    message: "Artists fetched successfully",
    data: formattedOutput,
  });
};

export {
  addToLikedSongs,
  getLikedSongs,
  removeFromLikedSongs,
  getAlbum,
  getArtist,
};
