import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../layout/card";
import CardCarousel from "../layout/cardCarousel";
import { getPlaylist } from "../../../Redux/slice/user.Slice/playlistSlice";

const Playlist = () => {
  const dispatch = useDispatch();
  const { playlist, status, error } = useSelector((state) => state.playlist);

  useEffect(() => {
    dispatch(getPlaylist());
    console.log("Playlist State:", playlist);
  }, [dispatch]);

  if (status === "pending") {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (status === "rejected") {
    return <div className="text-white text-center">{error}</div>;
  }

  const playlistArray = Array.isArray(playlist) ? playlist : [];
  if (playlistArray.length === 0) {
    return <div className="text-white text-center">No playlist found.</div>;
  }

  const newPlaylist = playlistArray; // Directly use playlistArray

  return (
    <div className="bg-stone-950 mt-10 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Playlist</h2>
      <CardCarousel>
        {newPlaylist.map((playlistItem) => {
          const firstSong = playlistItem?.songs?.[0];
          const image = firstSong?.image || "default.jpg";
          return (
            <Link
              key={playlistItem._id}
              to={`/playlist/playcomponent/${playlistItem._id}`}
            >
              <Card
                image={image}
                title={playlistItem.name}
                artist={firstSong?.artist || "Unknown"}
                id={playlistItem._id}
                gradient="from-green-400 to-blue-500"
              />
            </Link>
          );
        })}
      </CardCarousel>
    </div>
  );
};

export default Playlist;