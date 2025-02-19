import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaMusic } from "react-icons/fa"; // Import icons

const Bar = () => {
  return (
    <nav className="bg-stone-950 p-4 sm:hidden">
      {" "}
      {/* Hide on larger screens */}
      <ul className="flex justify-around">
        <li>
          <Link
            to="/"
            className="flex flex-col items-center text-white font-semibold hover:text-gray-300 transition duration-200"
          >
            <FaHome className="text-lg" /> {/* Home icon */}
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/search"
            className="flex flex-col items-center text-white font-semibold hover:text-gray-300 transition duration-200"
          >
            <FaSearch className="text-lg" /> {/* Search icon */}
            Search
          </Link>
        </li>
        <li>
          <Link
            to="/laibrery"
            className="flex flex-col items-center text-white font-semibold hover:text-gray-300 transition duration-200"
          >
            <FaMusic className="text-lg" /> {/* Music icon */}
            Your Library
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Bar;
