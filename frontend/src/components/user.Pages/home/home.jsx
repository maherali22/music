import React from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPlaylist } from "../../../Redux/slice/user.Slice/playlistSlice";

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

      <div className="flex mt-16">
        {/* Sidebar */}
        <div className="hidden sm:block sm:w-1/4 lg:w-1/5 bg-neutral-900 h-screen overflow-y-auto">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
