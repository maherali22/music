import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getLikedSongs } from "../../../Redux/slice/user.Slice/likedSlice";
import { getPlaylist } from "../../../Redux/slice/user.Slice/playlistSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = localStorage.getItem("currentUser");
  const { playlist } = useSelector((state) => state.playlist);
  const { likedSongs } = useSelector((state) => state.likedSong);

  useEffect(() => {
    if (user) {
      dispatch(getPlaylist());
      dispatch(getLikedSongs());
      console.log(likedSongs);
    }
  }, [dispatch, user]);

  return (
    <div className="bg-stone-950 text-white rounded-lg w-full max-w-6xl mx-auto mt-8 shadow-lg p-4">
      <div className="bg-gradient-to-b from-violet-950 to-gray-700 p-4 w-full min-h-[25vh] rounded-lg shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Liked Songs */}
          <Link to="/likedsongs">
            <div className="bg-stone-900 rounded-lg flex items-center p-3 gap-2 hover:scale-105 hover:bg-stone-800 transition-all">
              <img
                src={likedSongs[0]?.image || "default-image-url.jpg"}
                alt="Liked Songs"
                className="h-12 w-12 object-cover rounded-lg"
              />
              <h1 className="text-xs font-medium truncate">Liked Songs</h1>
            </div>
          </Link>
          {/* Playlists */}
          {playlist?.slice(0, 5).map((pl) => (
            <Link key={pl._id} to={`/playlist/playlcomponent/${pl._id}`}>
              <div className="bg-stone-900 rounded-lg flex items-center p-3 gap-2 hover:scale-105 hover:bg-stone-800 transition-all">
                <img
                  src={pl.songs[0]?.image || "default-image-url.jpg"}
                  alt={pl.name}
                  className="h-12 w-12 object-cover rounded-lg"
                />
                <h1 className="text-xs font-normal truncate">{pl.name}</h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
