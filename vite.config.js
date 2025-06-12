import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Inspect from "vite-plugin-inspect";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), Inspect(), svgr()],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },
  base: "/graduation-front/", // necessary for GH Pages
});
