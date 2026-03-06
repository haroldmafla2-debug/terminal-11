import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      reporter: ["text", "html"],
      include: ["src/lib/**/*.ts", "src/services/**/*.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
