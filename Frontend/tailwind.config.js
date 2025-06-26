/** @type {import('tailwindcss').Config} */
import colors from "./src/utils/colors";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // scan all your source files
  ],
  theme: {
    extend: {
      backgroundImage: {
        "auth-radial":
          "radial-gradient(circle, #2A1C63 18%, #3E1E6C 49%, #471C53 82%)",
      },
      keyframes: {
        "book-fly": {
          "0%": { transform: "translate(-50%, -300px)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translate(-50%, 160px)", opacity: "1" },
        },
        "move-prev": {
          "0%, 100%": { transform: "rotate(-135deg) translateX(0)" },
          "50%": { transform: "rotate(-145deg) translateX(20px)" },
        },
        "move-next": {
          "0%, 100%": { transform: "rotate(45deg) translateX(0)" },
          "50%": { transform: "rotate(60deg) translateX(20px)" },
        },
      },
      animation: {
        "book-fly": "book-fly 2s ease-out forwards",
        "prev": "move-prev 0.6s infinite",
        "next": "move-next 0.6s infinite",
      },
      colors,
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
