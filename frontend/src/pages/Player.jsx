import React from 'react';
import Header from '../components/Header';

export default function Player() {
  return (
    <div className="min-h-screen bg-white text-black font-serif">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Audio Player</h1>
        <p className="text-gray-500">
          This is a placeholder for an audio player. In a full app, you could queue tracks or integrate streaming.
        </p>
      </div>
    </div>
  );
}
