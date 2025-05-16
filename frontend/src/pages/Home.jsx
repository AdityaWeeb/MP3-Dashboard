import React from 'react';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-serif">
      <Header />
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Music Search 🎵</h1>
        <p className="text-gray-600">
          Use the search page to find your favorite YouTube tracks, download them, and manage your favorites.
        </p>
      </div>
    </div>
  );
}
