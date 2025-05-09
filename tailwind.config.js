/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lightPurple: 'rgba(159, 127, 255, 1)',
        darkPurple: 'rgba(128, 85, 254, 1)',
        lightLavender: '#B5DDEA',
        darkLavender: '#B4B1E5',
        offWhite: 'rgba(255, 255, 255, 0.4)',
        primaryYellow: "#FFC629",
        lavender: "#B4B1E5",
        blue: "#B5DDEA",
        darkBlack: "#141414",
        lightBlack: "#212121",
        darkGray: "#393939",
        lightGray: "#B2B2B2",
        white: "#FFFFFF",
        bgColor: "#FAF0E5",
        orange: '#FFC629',
      },
      fontFamily: {
        sans: ['normalFont', 'sans-serif'],
        lightFont: ['lightFont'],
        boldFont: ['boldFont'],
        mediumFont: ['mediumFont'],
        normalFont: ['normalFont'],
        heavyFont: ['heavyFont'],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
        "8xl": "6rem",
        "9xl": "8rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    },
  ],
}