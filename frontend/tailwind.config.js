/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F2042',
          'navy-light': '#1E3A8A',
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          blue: '#2563EB',
          accent: '#06B6D4',
          slate: '#0F172A',
          gray: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

