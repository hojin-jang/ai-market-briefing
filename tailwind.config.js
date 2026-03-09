/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2a7dcf",
        "background-dark": "#121920",
        "market-up": "#ef4444",
        "market-down": "#3b82f6",
        "card-bg": "#1c252e",
      },
    },
  },
  plugins: [],
};
