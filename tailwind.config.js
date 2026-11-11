/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Nunito Sans"', 'sans-serif'] },
      colors: {
        primary: '#4880FF',
        page: { DEFAULT: '#F5F6FA', dark: '#1B2431' },
        card: { DEFAULT: '#FFFFFF', dark: '#273142' },
        ink: { DEFAULT: '#202224', dark: '#FFFFFF' },
        muted: { DEFAULT: '#646464', dark: '#A3AED0' },
        line: { DEFAULT: '#E0E0E0', dark: '#37445A' },
      },
      boxShadow: { card: '6px 6px 54px rgba(0,0,0,0.05)' },
    },
  },
  plugins: [],
}
