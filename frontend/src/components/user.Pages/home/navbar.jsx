import { useEffect, useState } from "react";
import {
  FaSpotify,
  FaSearch,
  FaUser,
  FaCog,
  FaDownload,
  FaHome,
} from "react-icons/fa";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../Redux/slice/user.Slice/authSlice";
import { adminLogout } from "../../../Redux/slice/admin.Slice/adminAuthSlice";
import { getAllUsers } from "../../../Redux/slice/admin.Slice/adminUserSlice";
import { getAllSongs } from "../../../Redux/slice/user.Slice/songSlice";
import { persistor } from "../../../Redux/store/store";
import Searchbar from "./serachBar";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const admin = useSelector((state) => state.admin?.user);
  const { songs, status } = useSelector((state) => state.song);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (user) {
      dispatch(logout());
      persistor.purge().then(() => {
        localStorage.clear();
      });
    } else if (admin) {
      dispatch(adminLogout());
      persistor.purge().then(() => {
        localStorage.clear();
      });
    }
    navigate("/");
    window.location.reload();
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllSongs());
  }, [dispatch]);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  return (
    <nav className="bg-black h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between fixed w-full top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          className="text-white lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <FaSpotify className="text-green-500 text-3xl" />
          <span className="text-white font-bold text-xl hidden md:block">
            Spotify
          </span>
        </Link>
      </div>

      {/* Center Section - Desktop Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
        <Link
          to="/"
          className="flex items-center text-white bg-stone-900 hover:scale-110 transform transition duration-500 p-2 rounded-full mr-5"
        >
          <FaHome size={24} />
        </Link>
        <div className="w-full flex items-center bg-white/10 rounded-full px-4 py-2 gap-3 text-gray-400 hover:bg-white/15 transition-colors">
          <FaSearch size={20} />
          <Searchbar songs={songs} status={status} />
        </div>
      </div>

      {/* Right Section - Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <Link
            to="/premium"
            className="hover:text-white transition-colors hidden xl:block"
          >
            Premium
          </Link>
          <Link
            to="/support"
            className="hover:text-white transition-colors hidden xl:block"
          >
            Support
          </Link>
          <Link
            to="/download"
            className="hover:text-white transition-colors flex items-center gap-2"
          >
            <FaDownload size={16} />
            <span>Install App</span>
          </Link>
          <div className="h-6 w-px bg-gray-600" />
        </div>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-black hover:bg-white/10 rounded-full p-1 pr-2 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="w-full h-full p-2" />
                )}
              </div>
              <span className="text-white font-medium text-sm">
                {user.name}
              </span>
              <FiChevronDown className="text-white" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-900 rounded-lg shadow-lg py-2 text-sm">
                <Link
                  to="/account"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-gray-300 hover:text-white"
                >
                  <FaUser size={16} />
                  Account
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-gray-300 hover:text-white"
                >
                  <FaCog size={16} />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 text-gray-300 hover:text-white"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/register"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-400 text-black font-medium transition-colors"
            >
              Log in
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu - Slide-out */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-black lg:hidden p-4 border-r border-white/10 z-50">
          <div className="mb-4">
            <div className="flex items-center bg-white/10 rounded-full px-4 py-2 gap-3 text-gray-400">
              <FaSearch size={20} />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent flex-1 text-sm text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 text-gray-300">
            <Link to="/premium" className="py-2 hover:text-white">
              Premium
            </Link>
            <Link to="/support" className="py-2 hover:text-white">
              Support
            </Link>
            <Link to="/download" className="py-2 hover:text-white">
              Download
            </Link>
            {user ? (
              <>
                <Link to="/account" className="py-2 hover:text-white">
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 hover:text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to="/register"
                  className="py-2 text-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="py-2 text-center rounded-full bg-green-500 hover:bg-green-400 text-black"
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
