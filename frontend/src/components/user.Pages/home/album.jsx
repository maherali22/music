import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardCarousel from "../layout/cardCarousel";
import Card from "../layout/card";
import { Link } from "react-router-dom";
import { getAlbums } from "../../../Redux/slice/user.Slice/albumSlice";

const Album = () => {
  const dispatch = useDispatch();
  const { albums, status } = useSelector((state) => state.albums);
  console.log("albums:", albums);

  useEffect(() => {
    dispatch(getAlbums());
  }, [dispatch]);
  if (status === "pending") {
    return <div className="text-white text-center">Loading...</div>;
  }
  if (status === "rejected") {
    return <div className="text-white text-center">Error: {error}</div>;
  }

  return (
    <div className="bg-stone-950  text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Albums</h1>
      <CardCarousel>
        {albums.map((album) => (
          <Link key={album._id} to={`/albums/playlcomponent/${album._id}`}>
            <Card
              image={album.songs[0]?.image}
              title={album.songs[0]?.album}
              artist={album.songs[0]?.artist}
            />
          </Link>
        ))}
      </CardCarousel>
    </div>
  );
};

export default Album;
