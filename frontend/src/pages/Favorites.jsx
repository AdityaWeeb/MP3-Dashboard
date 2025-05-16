import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    setFavorites(saved ? JSON.parse(saved) : []);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-serif">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>

        {favorites.length === 0 ? (
          <p className="text-gray-500">You haven’t added any favorites yet.</p>
        ) : (
          <ul className="space-y-6">
            {favorites.map((videoId, idx) => (
              <li key={idx} className="flex items-center border border-gray-300 rounded p-4">
                <img
                  src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                  alt="Favorite"
                  className="w-24 h-24 rounded object-cover"
                />
                <div className="ml-4">
                  <h2 className="font-medium">Video ID: {videoId}</h2>
                  <a
                    href={`http://localhost:8000/api/stream?videoId=${videoId}`}
                    download
                    className="inline-block mt-2 px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
