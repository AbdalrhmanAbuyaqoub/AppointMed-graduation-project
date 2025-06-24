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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: [
            "@mantine/core",
            "@mantine/hooks",
            "@mantine/form",
            "@mantine/dates",
          ],
          query: ["@tanstack/react-query"],
          icons: ["@tabler/icons-react"],
          // Separate chunks for large pages
          chat: ["src/pages/Chat.jsx"],
          appointments: ["src/pages/Appointments.jsx"],
          doctors: ["src/pages/DoctorDetails.jsx"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kb to reduce warnings
  },
  base: "/graduation-front/", // necessary for GH Pages
});
