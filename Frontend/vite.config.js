import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["@radix-ui/react-dialog"]
  },  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@admin": path.resolve(__dirname, "./src/admin"),
    },
  },
  build: {
    // Split large vendor libraries into their own chunks so no single file is
    // huge and the browser can cache them independently.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/react-router|@remix-run/.test(id)) return "router";
          if (/react-dom|scheduler|\/react\//.test(id)) return "react";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("swiper")) return "swiper";
          if (/recharts|d3-|victory/.test(id)) return "charts";
          if (id.includes("lucide-react")) return "icons";
          if (/redux|@reduxjs/.test(id)) return "redux";
          return "vendor";
        },
      },
    },
  },
})
