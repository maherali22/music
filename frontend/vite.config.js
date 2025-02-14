import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000,
  },
  theme: {
    extend: {
      colors: {
        spotify: {
          green: "#1DB954",
          black: "#191414",
          dark: "#121212",
          light: "#282828",
          gray: "#B3B3B3",
        },
        transitionProperty: {
          height: "height",
          spacing: "margin, padding",
        },
      },
    },
  },
});
