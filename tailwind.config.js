/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#121212",
        darkcard: "#1E1E1E",
        accent: "#FF8C00",
        accentLight: "#FFA733",
      },
    },
  },
  plugins: [],
}

