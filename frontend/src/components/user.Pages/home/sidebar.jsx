import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  Search,
  ChevronRight,
  ChevronLeft,
  Plus,
  Heart,
  MoreHorizontal,
  Library,
  Pin,
} from "lucide-react";
import {
  deletePlaylist,
  getUserPlaylist,
} from "../../../Redux/slice/user.Slice/userPlaylistSlice";
import { getPlaylist } from "../../../Redux/slice/user.Slice/playlistSlice";

const SpotifySidebar = () => {
  const dispatch = useDispatch();
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [pinnedPlaylists, setPinnedPlaylists] = useState([]);

  // Corrected Redux state selector: use state.userPlaylist instead of state.playlist
  const userPlaylist = useSelector(
    (state) => state.userPlaylist.userPlaylist || []
  );

  const user = localStorage.getItem("currentUser");

  useEffect(() => {
    dispatch(getUserPlaylist()).then((result) => {
      console.log("Fetched playlists:", result.payload);
    });
  }, [dispatch]);

  const handleDelete = async (playlistId) => {
    await dispatch(deletePlaylist({ playlistId }));
    await dispatch(getUserPlaylist());
    await dispatch(getPlaylist());
  };

  const togglePin = (playlistId) => {
    setPinnedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
    setIsDropdownOpen(null);
  };

  return (
    <div className="flex flex-col mt-[60px] h-[680px] gap-2 p-2 bg-black overflow-y-auto">
      {/* Library Section */}
      <div className="flex-1 bg-neutral-900 rounded-lg overflow-hidden">
        {/* Library Header */}
        <div className="p-2 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Library className="w-6 h-6 text-neutral-400" />
              <span className="font-medium hidden md:block text-white">
                Your Library
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/createplaylist"
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors hidden md:block"
              >
                {isLibraryExpanded ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Library Filters */}
        <div className="bg-[#1F1F1F] text-white rounded-lg shadow-md p-6 ml-2 mb-2 w-64">
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">
              Create your first playlist
            </h2>
            <p className="text-gray-400 mb-4">It's easy, we'll help you</p>
            <button className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition duration-300">
              Create playlist
            </button>
          </div>
        </div>

        {/* Playlists */}
        <div className="overflow-y-auto flex-1 px-2 pb-2">
          <div className="space-y-2">
            {user ? (
              userPlaylist.length > 1 ? (
                userPlaylist.map((playlistItem) => (
                  <div
                    key={playlistItem._id}
                    className="group flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <Link
                      to={`/userplaylist/playcomponent/${playlistItem._id}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <img
                        src={
                          playlistItem?.songs?.[0]?.image ||
                          "/default-image.png"
                        }
                        alt={playlistItem.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      {isLibraryExpanded && (
                        <div className="flex-1 hidden md:block">
                          <h4 className="text-white font-medium truncate">
                            {playlistItem.name}
                          </h4>
                          <p className="text-sm text-neutral-400 truncate">
                            Playlist • {playlistItem.songs?.length || 0} songs
                          </p>
                        </div>
                      )}
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(playlistItem._id)}
                        className="p-2 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      {isDropdownOpen === playlistItem._id && (
                        <div className="absolute right-4 mt-2 w-48 bg-neutral-800 rounded-lg shadow-xl z-50">
                          <div className="py-1">
                            <button
                              onClick={() => togglePin(playlistItem._id)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-neutral-700"
                            >
                              <Pin className="w-4 h-4" />
                              {pinnedPlaylists.includes(playlistItem._id)
                                ? "Unpin"
                                : "Pin"}
                            </button>
                            <button
                              onClick={() => handleDelete(playlistItem._id)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-neutral-700"
                            >
                              Delete Playlist
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2 text-sm text-neutral-400">
                  No playlists available
                </div>
              )
            ) : (
              <div className="p-2 text-sm text-neutral-400">
                Login to view playlists
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pinned Playlists */}
      {pinnedPlaylists.length > 0 && (
        <div className="bg-neutral-900 rounded-lg p-2">
          <h3 className="text-sm text-neutral-400 font-medium mb-2 px-2">
            Pinned
          </h3>
          <div className="space-y-2">
            {userPlaylist
              .filter((playlist) => pinnedPlaylists.includes(playlist._id))
              .map((playlistItem) => (
                <div
                  key={playlistItem._id}
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Link
                    to={`/userplaylist/playcomponent/${playlistItem._id}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <img
                      src={
                        playlistItem?.songs?.[0]?.image || "/default-image.png"
                      }
                      alt={playlistItem.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    {isLibraryExpanded && (
                      <div className="flex-1 hidden md:block">
                        <h4 className="text-white font-medium truncate">
                          {playlistItem.name}
                        </h4>
                        <p className="text-sm text-neutral-400 truncate">
                          Playlist • {playlistItem.songs?.length || 0} songs
                        </p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotifySidebar;
