import mongoose from "mongoose";

const likedSongSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
  ],
});

const LikedSong = mongoose.model("LikedSong", likedSongSchema);
export default LikedSong;
