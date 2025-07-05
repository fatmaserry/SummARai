import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["pdfjs-dist"],
    exclude: ["pdfjs-dist/build/pdf.worker.min.js"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "pdf-worker": ["pdfjs-dist/build/pdf.worker.min.js"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
