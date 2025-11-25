/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        accent: '#f59e0b',
        surface: '#0f172a'
      },
      fontSize: {
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
      },
    }
  },
  plugins: []
};
