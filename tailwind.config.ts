import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2a7dcf",
        "background-dark": "#121920",
        "market-up": "#ef4444",
        "market-down": "#3b82f6",
        "card-bg": "#1c252e",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
