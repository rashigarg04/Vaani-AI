/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#FAF8FF',
          100: '#F5F2FF',
          200: '#ECE5FF',
          300: '#D9CCFF',
          400: '#BEA6FF',
          500: '#9E75FF',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        brand: {
          violet: '#7C3AED',
          purple: '#9333EA',
          softBg: '#FBFBFE',
          cardBg: '#FFFFFF',
          lavenderBg: '#F5F3FF',
          border: '#EDE9FE',
          textDark: '#1E1B4B',
          textMuted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-bar': 'wave 1.2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'scaleY(0.2)' },
          '100%': { transform: 'scaleY(1.0)' },
        }
      }
    },
  },
  plugins: [],
}
