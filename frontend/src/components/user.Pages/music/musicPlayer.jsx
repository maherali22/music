import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { IconButton, Slider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ReactAudioPlayer from "react-audio-player";
import {
  addToLikedSongs,
  removeFromLikedSongs,
  getLikedSongs,
} from "../../../Redux/slice/user.Slice/likedSlice";

const MusicController = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Progress percentage (0-100)
  const { id1, id2 } = useParams();
  const [songs, setSongs] = useState([]);
  const audioPlayerRef = useRef(null); // Ref for the audio player
  const dispatch = useDispatch();

  // Redux state selectors
  const artist = useSelector((state) => state.artist.artist);
  const playlist = useSelector((state) => state.playlist.playlist);
  const likedSongs = useSelector((state) => state.likedSong.likedSongs);
  const allSongs = useSelector((state) => state.song.songs);

  // Fetch songs based on the current route (artist, album, playlist, or individual song)
  useEffect(() => {
    const filteredArtist = artist?.find((item) => item.artist === id2);
    const filteredPlaylist = playlist?.find((item) => item._id === id2);
    const filteredSong = allSongs.find((song) => song._id === id1);
    const songsForPlay =
      (filteredPlaylist && filteredPlaylist.songs) ||
      (filteredArtist && filteredArtist.songs) ||
      (filteredSong && [filteredSong]) || // Wrap in an array to ensure consistency
      (likedSongs && likedSongs.length > 0 ? likedSongs : []) ||
      [];
    setSongs(songsForPlay);
  }, [artist, playlist, likedSongs, allSongs, id2]);

  // Set the current song index based on the `id1` parameter
  useEffect(() => {
    const songIndex = songs.findIndex((song) => song._id === id1);
    if (songIndex >= 0) {
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    }
  }, [id1, songs]);

  // Automatically play the audio when `isPlaying` changes
  useEffect(() => {
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.audioEl.current.play(); // Explicitly play the audio
    }
  }, [currentSongIndex, isPlaying]);

  // Handle next song
  const handleNext = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(true);
  };

  // Handle previous song
  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
    setIsPlaying(true);
  };

  // Handle song end (auto-play next song)
  const handleSongEnd = () => {
    handleNext();
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.audioEl.current.pause();
      } else {
        audioPlayerRef.current.audioEl.current.play();
      }
    }
  };

  // Check if the current song is liked
  const isLiked =
    songs[currentSongIndex] &&
    likedSongs.some((song) => song._id === songs[currentSongIndex]._id);

  // Add a song to liked songs
  const addToFavourite = async (songId) => {
    await dispatch(addToLikedSongs(songId));
    await dispatch(getLikedSongs());
  };

  // Remove a song from liked songs
  const removeFromFavourite = async (songId) => {
    await dispatch(removeFromLikedSongs(songId));
    await dispatch(getLikedSongs());
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-col">
      {/* Navbar */}
      <div>
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex justify-center items-center mt-[20px] w-96 bg-black">
          <Card
            sx={{
              backgroundColor: "#000",
              borderRadius: "8px",
              boxShadow: 3,
              width: "700px",
              height: "900px",
              color: "#fff",
            }}
            className="flex bg-[#121212] rounded-lg shadow-lg"
          >
            <CardContent className="flex flex-col items-center justify-center sm:justify-normal">
              {songs.length > 0 && songs[currentSongIndex] ? (
                <>
                  {/* Song Image */}
                  <img
                    src={songs[currentSongIndex].image}
                    alt={songs[currentSongIndex].title}
                    className="w-[700px] h-[320px] rounded-lg object-cover mb-4"
                  />
                  {/* Song Title */}
                  <Typography
                    variant="h5"
                    component="div"
                    className="mt-2 text-white"
                  >
                    {songs[currentSongIndex].title}
                  </Typography>
                  {/* Artist Name */}
                  <Typography variant="body2" className="text-gray-400">
                    {songs[currentSongIndex].artist}
                  </Typography>
                  {/* Audio Player */}
                  <ReactAudioPlayer
                    ref={audioPlayerRef}
                    src={songs[currentSongIndex].fileUrl}
                    autoPlay={isPlaying}
                    controls
                    className="w-full mt-2 bg-black"
                    onEnded={handleSongEnd}
                  />
                  {/* Controls */}
                  <div className="flex justify-center mt-2">
                    <IconButton
                      sx={{ color: "white" }}
                      onClick={handlePrevious}
                      className="text-white"
                    >
                      <SkipPreviousIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "white" }}
                      onClick={togglePlayPause}
                      className="text-white"
                    >
                      {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton
                      sx={{ color: "white" }}
                      onClick={handleNext}
                      className="text-white"
                    >
                      <SkipNextIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: isLiked ? "green" : "white" }}
                      onClick={async () => {
                        if (isLiked) {
                          await removeFromFavourite(
                            songs[currentSongIndex]._id
                          );
                        } else {
                          await addToFavourite(songs[currentSongIndex]._id);
                        }
                      }}
                      className="text-white"
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  </div>
                </>
              ) : (
                <Typography variant="body2" className="text-gray-400">
                  No songs available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-neutral-900 p-4 flex items-center gap-4">
        {/* Album Art */}
        <img
          src={songs[currentSongIndex]?.image || "default.jpg"}
          alt="Album Art"
          className="w-16 h-16 object-cover rounded-md"
        />
        {/* Song Metadata */}
        <div className="flex-grow">
          <p className="text-sm font-medium text-white truncate">
            {songs[currentSongIndex]?.title || "No song playing"}
          </p>
          <p className="text-xs text-gray-400">
            {songs[currentSongIndex]?.artist || "Unknown artist"}
          </p>
        </div>
        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <IconButton onClick={togglePlayPause}>
            {isPlaying ? (
              <PauseIcon sx={{ color: "white" }} />
            ) : (
              <PlayArrowIcon sx={{ color: "white" }} />
            )}
          </IconButton>
          <IconButton onClick={handleNext}>
            <SkipNextIcon sx={{ color: "white" }} />
          </IconButton>
        </div>
        {/* Progress Bar */}
        <Slider
          value={progress}
          onChange={(e, newValue) => setProgress(newValue)}
          sx={{
            color: "white",
            "& .MuiSlider-thumb": {
              display: "none",
            },
          }}
          className="w-40"
        />
        {/* Volume Control */}
        <IconButton>
          <VolumeUpIcon sx={{ color: "white" }} />
        </IconButton>
      </div>
    </div>
  );
};

export default MusicController;
