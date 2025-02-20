import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import daisyui from "daisyui";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), daisyui()],
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
