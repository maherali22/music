import { useState } from "react";
import { Link } from "react-router-dom";

const Searchbar = ({ songs, status }) => {
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState(false);

  const filteredsongs = songs?.filter((song) => {
    const word = search.toLowerCase().trim();
    return (
      song.title.toLowerCase().includes(word) ||
      song.artist.toLowerCase().includes(word) ||
      song.album.toLowerCase().includes(word)
    );
  });

  // setSongs(filteredsongs)

  return (
    <div className="relative w-full max-w-md ">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="What do you want to play?"
          onFocus={() => setIsActive(true)}
          onBlur={() => setTimeout(() => setIsActive(false), 200)}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="w-full p-2 bg-stone-900 text-white rounded-lg focus:outline-none md:p-3"
        />
      </div>

      {isActive && search && (
        <div className="absolute top-full left-0 mt-1 w-full bg-stone-900 text-white rounded-lg shadow-lg max-h-56 overflow-y-auto z-50 scrollbar-none">
          {status === "loading" && <p className="p-2">Loading songs...</p>}
          {status === "error" && (
            <p className="p-2 text-red-500">Failed to load songs.</p>
          )}
          {filteredsongs.length > 0 ? (
            <ul>
              {filteredsongs.map((song) => (
                <Link key={song._id} to={`/searchbar/${song._id}`}>
                  <li className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg">
                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                      <p className="text-sm text-gray-500">{song.album}</p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="p-2">No songs found for "{search}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
