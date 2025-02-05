import React from 'react';
import './index.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}

export default App;