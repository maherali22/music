import React from "react";
import "./index.css";
import "./app.css";
import Register from "./components/user.Pages/auth/registeration.jsx";
import { Routes, Route } from "react-router-dom";
import OtpVerify from "./components/user.Pages/auth/otpVerification.jsx";
import Login from "./components/user.Pages/auth/login.jsx";
import Home from "./components/user.Pages/home/home.jsx";
import PlaylistComponent from "./components/user.Pages/music/playlistComponent.jsx";
import MusicController from "./components/user.Pages/music/musicPlayer.jsx";

function App() {
  return (
    <div className="bg-gradient-to-b from-[#2a2d2b] to-[#191414] text-white min-h-screen">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/artist/playcomponent/:id1/:id2"
          element={<MusicController />}
        />
        <Route
          path="/playlist/playlcomponent/:id"
          element={<PlaylistComponent />}
        />
        <Route
          path="/userplaylist/playcomponent/:userplaylists"
          element={<PlaylistComponent />}
        />
      </Routes>
    </div>
  );
}

export default App;
