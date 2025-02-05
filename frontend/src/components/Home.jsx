import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  // Mock data for sections
  const popularArtists = [
    { id: 1, name: "Pritam", image: "https://via.placeholder.com/100" },
    { id: 2, name: "Arijit Singh", image: "https://via.placeholder.com/100" },
    { id: 3, name: "A.R. Rahman", image: "https://via.placeholder.com/100" },
    { id: 4, name: "Shreya Ghoshal", image: "https://via.placeholder.com/100" },
  ];

  const popularAlbums = [
    { id: 1, title: "Rockstar", artist: "A.R. Rahman", image: "https://via.placeholder.com/150" },
    { id: 2, title: "Tamasha", artist: "Pritam", image: "https://via.placeholder.com/150" },
    { id: 3, title: "Jab We Met", artist: "Pritam", image: "https://via.placeholder.com/150" },
    { id: 4, title: "Raees", artist: "JAM8", image: "https://via.placeholder.com/150" },
  ];

  const popularRadios = [
    { id: 1, name: "Bollywood Hits", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Indie Vibes", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Classical Melodies", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Romantic Nights", image: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="p-6">
      {/* Your Library Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">Your Library</h2>
        <div className="flex gap-4">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition">
            Create Playlist
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition">
            Browse Podcasts
          </button>
        </div>
      </motion.section>

      {/* Popular Artists Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Popular Artists</h2>
          <button className="text-green-500 hover:underline">Show all</button>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {popularArtists.map((artist) => (
            <motion.div
              key={artist.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
              <p className="text-sm font-semibold">{artist.name}</p>
              <p className="text-xs text-gray-400">Artist</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Popular Albums and Singles Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Popular Albums and Singles</h2>
          <button className="text-green-500 hover:underline">Show all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularAlbums.map((album) => (
            <motion.div
              key={album.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <img
                src={album.image}
                alt={album.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <p className="text-sm font-semibold">{album.title}</p>
              <p className="text-xs text-gray-400">{album.artist}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Popular Radio Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Popular Radio</h2>
          <button className="text-green-500 hover:underline">Show all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularRadios.map((radio) => (
            <motion.div
              key={radio.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <img
                src={radio.image}
                alt={radio.name}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <p className="text-sm font-semibold">{radio.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;