import React from "react";
import "./index.css";
import "./app.css";
import Register from "./components/user.Pages/auth/registeration.jsx";
import { Routes, Route } from "react-router-dom";
import OtpVerify from "./components/user.Pages/auth/otpVerification.jsx";
import Login from "./components/user.Pages/auth/login.jsx";
import Navbar from "./components/user.Pages/home/navbar.jsx";

function App() {
  return (
    <div className="bg-gradient-to-b from-[#2a2d2b] to-[#191414] text-white min-h-screen">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navbar />} />
      </Routes>
    </div>
  );
}

export default App;
