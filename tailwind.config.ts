import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zahav: {
          950: "#07111F",
          900: "#0B1728",
          800: "#10243D",
          700: "#123A68",
          600: "#1559A7",
          500: "#1E73D8",
          400: "#49A0FF",
          100: "#EAF4FF"
        }
      }
    }
  },
  plugins: [],
};

export default config;
