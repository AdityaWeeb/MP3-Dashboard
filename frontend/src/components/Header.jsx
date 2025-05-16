import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-300 px-6 py-4 shadow-sm">
      <nav className="flex justify-center space-x-6 text-sm font-medium text-gray-700">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/search" className="hover:underline">Search</Link>
        <Link to="/player" className="hover:underline">Player</Link>
        <Link to="/favorites" className="hover:underline">Favorites</Link>
      </nav>
    </header>
  );
}
