/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#26A69A',
          dark: '#00897B',
          light: '#80CBC4',
        },
        secondary: {
          DEFAULT: '#FF7043',
          dark: '#E64A19',
        },
        warning: '#FFC107',
        success: '#4CAF50',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

