/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '7xl': '90rem', // override giá trị mặc định (~80rem)
      },
    },
  },
  plugins: [],
};
