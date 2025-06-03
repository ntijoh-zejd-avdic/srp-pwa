/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        'brand-start': '#B5A04A',
        'brand-end': '#C4B36E',

        'Bright-start': '#C8B937',
        'Bright-end': '#C87037',

        'Background-start': '#EFEBC6',
        'Background-end': '#EFD5C4',

        'Test-start': '#E6FF00',
        'Test-end': '#FC6B03'
      },

      backgroundImage: {
        'srp-section': 'linear-gradient(to right, #C87037 2%, #C8B937 100%)',

        'summary-section': 'linear-gradient(to right, #C8B937 2%, #C87037 100%)',

        'background-section': 'linear-gradient(to right, #EFEBC6 15%, #E8C3AB 85%)',

        'reverse-background-section': 'linear-gradient(to right, #E8C3AB 15%, #EFEBC6 85%)',

        'intense-reverse-background-section': 'linear-gradient(to right, #DDA683 15%, #E4DD9E 85%)',

      },
    },
  },
  plugins: [],
};
