/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f0', 100: '#fef0d9', 200: '#fdd9a8', 300: '#fbbb6c',
          400: '#f89535', 500: '#f57314', 600: '#e65a0a', 700: '#bf420b',
          800: '#983410', 900: '#7a2d11',
        },
        leaf: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
          400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
          800: '#166534', 900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}

