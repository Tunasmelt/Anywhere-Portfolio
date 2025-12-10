/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./portfolio.jsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Moonlit Whisper Palette
        'moonlit': {
          'dark': '#1C1D21',      // Dark background
          'mauve': '#A28BA6',     // Purple accent
          'sand': '#B9B9B0',      // Tan/Sand accent
          'light': '#CBCBCC',     // Light mauve
          'cream': '#F1E3E4',     // Cream/light background
        }
      }
    },
  },
  plugins: [],
}

