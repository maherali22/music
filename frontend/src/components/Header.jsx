import React from 'react';
import { FaSpotify } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-900">
      <div className="flex items-center gap-2">
        <FaSpotify className="text-green-500 text-2xl" />
        <h1 className="text-xl font-bold">Spotify</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white px-4 py-2 rounded-full pl-10"
          />
          <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button className="bg-green-500 px-4 py-2 rounded-full font-semibold">
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;