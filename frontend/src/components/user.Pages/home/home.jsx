import React from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPlaylist } from "../../../Redux/slice/user.Slice/playlistSlice";
import Dashboard from "./dashboard";
import Playlist from "./playlist";
import Bar from "./bar";
import Artist from "./artist";
import Album from "./album";

const Home = () => {
  const dispatch = useDispatch();
  const user = localStorage.getItem("currentUser");
  useEffect(() => {
    if (user) {
      dispatch(getPlaylist());
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-black shadow-md">
        <Navbar />
      </div>

      <div className="flex  flex-col md:flex-row">
        {/* Sidebar */}
        <div className="hidden sm:w-1/4 lg:w-1/5 sm:block">
          <Sidebar />
        </div>
        {/*dashboard */}
        <div className="flex-1 overflow-y-auto h-screen p-5 bg-stone-950 scrollbar-none">
          {user && (
            <div className="p-0 sm:p-6">
              <Dashboard />
            </div>
          )}

          <div className="p-0">
            <Playlist />
          </div>
          <div><Artist /></div>
          <div className="p-0">
            {/* <Album /> */}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Bar />
      </div>
    </div>
  );
};

export default Home;
