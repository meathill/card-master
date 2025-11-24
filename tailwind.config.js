/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        accent: '#f59e0b',
        surface: '#0f172a'
      }
    }
  },
  plugins: []
};
