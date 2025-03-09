/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0B0C10',
        'dark-blue': '#1F2833',
        gray: '#C5C6C7',
        teal: '#66FCF1',
        'teal-dark': '#45A29E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(102, 252, 241, 0.3)',
      },
    },
  },
  plugins: [],
};