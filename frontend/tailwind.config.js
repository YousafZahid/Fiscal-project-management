/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["inter", "sans-serif"], // Set "Poppins" as default
      },
      colors: {
        primary: "#FF9040", // Orange
        "primary-light": "#FFE8CC",
        secondary: "#D9D9D9", // Gray
        background: "#FFFFFF", // White
      },
    },
  },
  plugins: [],
}

