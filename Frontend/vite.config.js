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
    // Keep the default single vendor chunk. Manually splitting React out into
    // its own chunk caused a load-order bug in production (libraries calling
    // React.forwardRef before React initialised → white screen), so we just
    // raise the size-warning threshold instead of hand-splitting.
    chunkSizeWarningLimit: 1500,
  },
})
