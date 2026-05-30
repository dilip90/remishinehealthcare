/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#153B67',
        'primary-dark': '#0F2A4A',
        'primary-soft': '#EAF2F8',
        secondary: '#2FA66A',
        'secondary-dark': '#238655',
        'secondary-soft': '#EAF7F0',
        background: '#FFFFFF',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
