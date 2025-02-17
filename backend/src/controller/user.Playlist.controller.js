import CustomError from "../utils/customError.js";
import Playlist from "../models/schema/palyListSchema.js";

//1. create playlist

const createPlaylist = async (req, res, next) => {
  const { playlistName, songId } = req.body;

  const findPlaylist = await Playlist.findOne({
    user: req.user.id,
    name: playlistName,
  });

  if (findPlaylist) {
    const songInPlaylist = findPlaylist.songs.find(
      (song) => song.toString() === songId
    );

    if (songInPlaylist) {
      return next(new CustomError("Song already exists in playlist", 400));
    } else {
      findPlaylist.songs.push(songId);
      await findPlaylist.save();

      return res.status(200).json({
        success: true,
        message: "Song added to playlist",
        data: findPlaylist,
      });
    }
  } else {
    const playlist = new Playlist({
      user: req.user.id,
      name: playlistName,
      songs: [songId],
    });

    await playlist.save();

    return res.status(200).json({
      success: true,
      message: "Playlist created",
      data: playlist,
    });
  }
};
//2. get all playlist

const getAllPlaylist = async (req, res, next) => {
  const playlist = await Playlist.find().populate("songs");

  if (!playlist || playlist.length === 0) {
    return next(new CustomError("Playlist not found", 404));
  }

  const formattedPlaylist = playlist.map((playlist) => {
    return {
      ...playlist.toObject(),
      songs: playlist.songs.map((song) => {
        const min = Math.floor(song.duration / 60);
        const sec = song.duration % 60;
        const formattedDuration = `${min}:${sec < 10 ? "0" : ""}${sec}`;

        return {
          ...song.toObject(),
          duration: formattedDuration,
        };
      }),
    };
  });

  res.status(200).json({
    success: true,
    message: "Playlist fetched successfully",
    data: formattedPlaylist,
  });
};

//3. get playlist by id

const getPlaylistById = async (req, res, next) => {
  const { id } = req.params;
  const playlist = await Playlist.findById(id).populate("songs");

  if (!playlist) {
    return next(new CustomError("Playlist not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Playlist fetched successfully",
    data: playlist,
  });
};

//4. delete song from  playlist

const deleteSongFromPlaylist = async (req, res, next) => {
  const id = req.user.id;
  const { playlistId, songId } = req.body;
  console.log("deleted ", id, playlistId, songId);

  const playlist = await Playlist.findOne({
    user: id,
    _id: playlistId,
  });

  if (!playlist) {
    return next(new CustomError("Playlist not found", 404));
  }

  const songIndex = playlist.songs.findIndex((song) => song._id.equals(songId));

  if (songIndex === -1) {
    return next(new CustomError("Song not found in playlist", 404));
  }

  playlist.songs.splice(songIndex, 1);
  await playlist.save();

  res.status(200).json({
    success: true,
    message: "Playlist deleted successfully",
    data: playlist,
  });
};

//5. delete playlist

const deletePlaylist = async (req, res, next) => {
  const { id } = req.params;
  await Playlist.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Playlist deleted successfully",
  });
};
//6. get playlist by user

const getPlaylist = async (req, res, next) => {
  const id = req.user.id;
  const playlist = await Playlist.find({ user: id }).populate("songs");
  if (!playlist) {
    return next(new CustomError("playlist not found", 400));
  }
  res.status(200).json(playlist);
};

export {
  createPlaylist,
  getAllPlaylist,
  getPlaylistById,
  deleteSongFromPlaylist,
  deletePlaylist,
  getPlaylist,
};
