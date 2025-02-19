import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import { FaPlay, FaPause, FaEllipsisH, FaHeart } from "react-icons/fa";
import { Button } from "@mui/material";
import {
  addToLikedSongs,
  removeFromLikedSongs,
  getLikedSongs,
} from "../../../Redux/slice/user.Slice/likedSlice";
import {
  createPlaylist,
  deleteSongFromPlaylist,
  getUserPlaylist,
} from "../../../Redux/slice/user.Slice/userPlaylistSlice";

const MusicCard = ({ album, songs, image, gradient }) => {
  const initialAudioSrc = songs?.[0]?.audioSrc || "";
  const audioRef = useRef(new Audio(initialAudioSrc));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [playlistDropdownIndex, setPlaylistDropdownIndex] = useState(null);
  const [input, setInput] = useState(false);
  const [name, setName] = useState("");

  const userPlaylist = useSelector((state) => state.userPlaylist.userPlaylist);
  const likedFromStore = useSelector((state) => state.likedSong.likedSongs);
  const currentUser = localStorage.getItem("currentUser");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getLikedSongs());
  }, [dispatch]);

  const handlePlayPause = async (index) => {
    if (!currentUser) {
      toast.error("Please login");
      navigate("/login");
      return;
    }

    if (currentSongIndex === index) {
      isPlaying ? audioRef.current.pause() : await audioRef.current.play();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.pause();
      audioRef.current.src = songs[index]?.audioSrc || "";
      setCurrentSongIndex(index);
      setIsPlaying(true);
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const toggleDropdown = (index) => {
    if (!currentUser) {
      toast.error("Please login");
      return;
    }
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const togglePlaylistDropdown = (index) => {
    setPlaylistDropdownIndex(playlistDropdownIndex === index ? null : index);
  };

  const addToFavourite = async (songId) => {
    await dispatch(addToLikedSongs(songId));
    await dispatch(getLikedSongs());
  };

  const deleteFromFavourite = async (songId) => {
    await dispatch(removeFromLikedSongs(songId));
    await dispatch(getLikedSongs());
  };

  const addToPlaylist = async (playlistName, songId) => {
    await dispatch(createPlaylist({ playlistName, songsId: songId }));
    await dispatch(getUserPlaylist());
  };

  const handleSubmit = async (e, playlistName, songId) => {
    e.preventDefault();
    await dispatch(createPlaylist({ playlistName, songsId: songId }));
    await dispatch(getUserPlaylist());
    setInput(false);
    setName("");
  };

  return (
    <div>
      <h2>{album?.name || "Unknown Album"}</h2>
      <p>{songs?.[0]?.artist || "Unknown Artist"}</p>

      {songs?.map((song, index) => (
        <div key={index}>
          <span>{index + 1}</span>
          <span>{song.title}</span>
          <span>{song.duration}</span>

          <button
            onClick={() =>
              likedFromStore.some((fav) => fav._id === song.id)
                ? deleteFromFavourite(song.id)
                : addToFavourite(song.id)
            }
            className={`transition duration-200 ${
              likedFromStore.some((fav) => fav._id === song.id)
                ? "text-green-500 hover:text-green-700"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <FaHeart />
          </button>

          <button
            onClick={() => handlePlayPause(index)}
            className="w-16 h-8 flex items-center justify-center rounded-full transition-all duration-200"
          >
            {currentSongIndex === index && isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <button onClick={() => toggleDropdown(index)}>
            <FaEllipsisH />
          </button>

          {dropdownIndex === index && currentUser && (
            <div>
              <button onClick={() => togglePlaylistDropdown(index)}>
                Add to playlist
              </button>

              {playlistDropdownIndex === index && (
                <div>
                  {input ? (
                    <form onSubmit={(e) => handleSubmit(e, name, song.id)}>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <button type="submit">Create</button>
                    </form>
                  ) : (
                    <button onClick={() => setInput(true)}>
                      Create New Playlist
                    </button>
                  )}

                  {userPlaylist?.map((playlist) => (
                    <button
                      key={playlist._id}
                      onClick={() => addToPlaylist(playlist.name, song.id)}
                      className="block px-4 py-2 hover:bg-gray-700 rounded-md"
                    >
                      {playlist.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MusicCard;
