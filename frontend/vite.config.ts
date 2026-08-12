import path from "node:path";
import react from "@vitejs/plugin-react";
// vitest/config re-exports Vite's defineConfig with the `test` field typed in,
// so a single config file can serve both `vite` and `vitest`.
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/vitest-setup.ts",
  },
  server: {
    port: 5173,
    allowedHosts: [
      "thorthehost.in"
    ],
    // Forward API calls to the FastAPI backend during local development so
    // the browser never has to know the backend's port, and so cookies
    // set by the API are treated as same-origin.
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
