/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色
        primary: {
          DEFAULT: '#26A69A',
          light: '#80CBC4',
          dark: '#1E8E82',
        },
        // 状态色
        contract: {
          DEFAULT: '#FF7043',
          light: '#FFAB91',
        },
        relax: {
          DEFAULT: '#26A69A',
          light: '#81C784',
        },
        rest: '#80CBC4',
        countdown: '#FFC107',
      },
      animation: {
        'pulse-scale': 'pulse-scale 1s ease-in-out infinite',
        'fade-in': 'fade-in 300ms ease-out',
        'slide-up': 'slide-up 400ms ease-out',
      },
      keyframes: {
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

