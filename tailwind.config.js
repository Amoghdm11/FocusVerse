/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        silkscreen: ['"Silkscreen"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: {
          darkest: '#06030F',
          DEFAULT: '#0B0914',
          surface: '#120E24',
          card: '#16122C',
          overlay: '#1C1738',
        },
        arcade: {
          border: '#3E356B',
          gold: '#F5C242',
          cyan: '#5CE1E6',
          neonCyan: '#00F0FF',
          pink: '#FF007F',
          magenta: '#FF2A85',
          green: '#00FF66',
          crimson: '#7A283B',
          burntOrange: '#B85A32',
          warmGold: '#F2C14E',
        },
      },
      boxShadow: {
        'pixel': '4px 4px 0px #000000',
        'pixel-sm': '2px 2px 0px #000000',
        'pixel-lg': '6px 6px 0px #000000',
        'pixel-gold': '4px 4px 0px #F5C242',
        'pixel-cyan': '4px 4px 0px #5CE1E6',
        'pixel-pink': '4px 4px 0px #FF007F',
        'pixel-inset': 'inset 2px 2px 0px rgba(255,255,255,0.1), inset -2px -2px 0px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '0px',
      },
    },
  },
  plugins: [],
};
