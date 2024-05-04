/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          darkBlack: '#141414',
          lightBlack: '#212121',
        },
      },
    },
    plugins: [],
  }