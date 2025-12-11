/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'immersive-bg': '#0a0a0f',
        'immersive-surface': '#1a1a2e',
        'immersive-hover': '#252540',
        'immersive-accent': '#6366f1',
        'immersive-text': '#e0e0e0',
        'immersive-muted': '#808080',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
