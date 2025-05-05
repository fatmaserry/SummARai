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
      colors,
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
