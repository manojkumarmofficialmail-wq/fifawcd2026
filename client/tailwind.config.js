/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A1A2F',        // deep stadium navy
        'ink-2': '#0E2440',    // raised panels
        pitch: '#0B6E4F',      // field green
        grass: '#12B886',      // bright green accent
        gold: '#F5B700',       // trophy gold
        hot: '#E63E8C',        // WCD pink-magenta
        cream: '#F7F4ED',      // card paper
        muted: '#8FA0B3',      // secondary text on dark
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        head: ['"Archivo"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 40px -18px rgba(0,0,0,0.55)',
        glow: '0 0 0 1px rgba(245,183,0,0.4), 0 10px 40px -10px rgba(245,183,0,0.45)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        sweep: 'sweep 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
