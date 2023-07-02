import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ["vitest-localstorage-mock", "./src/test/setup.ts"],
    environment: "jsdom",
    css: false,
  },
});
