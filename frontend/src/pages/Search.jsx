import React, { useState } from 'react';
import Header from '../components/Header';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      console.log('Fetched tracks:', data.tracks);
      setResults(data.tracks || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setPlaying(null);
    }
  };

  const toggleFavorite = (videoId) => {
    const updated = favorites.includes(videoId)
      ? favorites.filter((id) => id !== videoId)
      : [...favorites, videoId];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Search for YouTube Tracks</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-grow p-3 rounded bg-gray-800 border border-gray-700 placeholder-gray-400 text-white"
            placeholder="Search tracks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-400">
            <span role="img" aria-label="loading">🔄</span> Searching...
          </div>
        )}

        {!loading && results.length === 0 && query.trim() !== '' && (
          <div className="text-center text-red-400">
            <span role="img" aria-label="no results">❌</span> No results for “{query}”
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid gap-6">
            {results.map((track, idx) => (
              <div
                key={idx}
                className="flex bg-white/5 border border-white/10 rounded-lg p-4 shadow hover:bg-white/10 transition"
              >
                <img
                  src={`https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg`}
                  alt={track.title}
                  className="w-32 h-20 rounded object-cover mr-4"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-bold">{track.title}</h2>
                  <p className="text-sm text-gray-300 mb-2">{track.artist}</p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                      onClick={() =>
                        playing === track.videoId ? setPlaying(null) : setPlaying(track.videoId)
                      }
                    >
                      {playing === track.videoId ? 'Stop' : 'Play'}
                    </button>

                    <a
                      href={`http://localhost:8000/api/stream?videoId=${track.videoId}`}
                      download
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Download
                    </a>

                    <button
                      className={`px-4 py-2 rounded text-white ${
                        favorites.includes(track.videoId)
                          ? 'bg-pink-500 hover:bg-pink-600'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                      onClick={() => toggleFavorite(track.videoId)}
                    >
                      {favorites.includes(track.videoId) ? '♥ Favorited' : '♡ Favorite'}
                    </button>
                  </div>

                  {playing === track.videoId && (
                    <audio
                      controls
                      autoPlay
                      src={`http://localhost:8000/api/stream?videoId=${track.videoId}`}
                      className="mt-3 w-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
