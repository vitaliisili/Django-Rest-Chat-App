/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif']
      },
      colors: {
        'shark': "#202c33",
        'cape': "#374045",
        'bunker-light': "#111b21",
        'bunker-dark': "#0c1317",
        'space': "#2a3942",
        'gallery': "#eeeeed",
        'nobel': "#797878",
        'nobel-light': "#ababab",
        'eden': "#005c4b",
      }
    },
  },
  plugins: [require("daisyui")],
}
