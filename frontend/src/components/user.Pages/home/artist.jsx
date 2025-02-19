import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardCarousel from "../layout/cardCarousel";
import Card from "../layout/card";
import { Link } from "react-router-dom";
import { getArtist } from "../../../Redux/slice/user.Slice/artistSlice";

const Artist = () => {
  const dispatch = useDispatch();
  const { artist } = useSelector((state) => state.artist);
  console.log("artist:", artist);

  useEffect(() => {
    dispatch(getArtist());
  }, [dispatch]);

  return (
    <div className="bg-stone-950 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4"> Artists </h1>
        <CardCarousel>
          {artist && artist.length > 0 ? (
            artist.map((art) =>
              art.songs && art.songs.length > 0
                ? art.songs.map((song) => (
                    <Link
                      key={song._id}
                      to={`/artist/playlcomponent/${art.artist}`}
                    >
                      <Card
                        image={song.image}
                        title={song.artist}
                        artist={art._id}
                      />
                    </Link>
                  ))
                : null
            )
          ) : (
            <div>No artists found</div>
          )}
        </CardCarousel>
     
    </div>
  );
};

export default Artist;
