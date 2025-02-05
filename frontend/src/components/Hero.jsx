import React from "react";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-600 to-green-800 text-center">
      <h1 className="text-5xl h-full font-bold mb-4">Listen to Your Favorite Music</h1>
      <p className="text-lg text-gray-200 mb-8">
        Stream millions of songs and podcasts on any device.
      </p>
      <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
        Get Started
      </button>
    </section>
  );
};

export default Hero;
