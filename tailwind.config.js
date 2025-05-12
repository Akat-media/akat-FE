/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '7xl': '90rem', // override giá trị mặc định (~80rem)
      },
    },
  },
  plugins: [scrollbar],
};
