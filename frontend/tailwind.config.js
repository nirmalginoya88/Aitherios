/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#000000',
          50: '#0a0a0a',
          100: '#111111',
          200: '#1A1A1A',
          300: '#242424',
          400: '#2e2e2e',
          500: '#3a3a3a',
        },
        steel: {
          DEFAULT: '#8a8a8a',
          100: '#c4c4c4',
          200: '#a0a0a0',
          300: '#707070',
          400: '#505050',
        },
        crimson: {
          DEFAULT: '#FF0000',
          50: '#fff0f0',
          100: '#ffe0e0',
          200: '#ffc0c0',
          300: '#ff8080',
          400: '#ff4040',
          500: '#FF0000',
          600: '#cc0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(255,0,0,0.4)',
        'glow-lg': '0 0 40px rgba(255,0,0,0.5)',
        'glow-sm': '0 0 10px rgba(255,0,0,0.25)',
        glass: '0 8px 32px rgba(0,0,0,0.6)',
        card: '0 4px 24px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,0,0,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255,0,0,0.7)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
