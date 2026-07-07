import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes asset paths relative, so the build works on
// GitHub Pages (username.github.io/cognitive-companion/) without
// hardcoding the repo name.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
