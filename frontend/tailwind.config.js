/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",   // if using CRA
    "./src/**/*.{js,jsx,ts,tsx}", // all src files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954', // Optional custom colors
        dark: '#121212',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
