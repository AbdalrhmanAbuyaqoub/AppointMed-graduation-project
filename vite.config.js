import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
  plugins: [react(), Inspect()],
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
});
