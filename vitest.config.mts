import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/utils/**", "src/features/**/lib/**", "src/components/ui/**"],
      exclude: ["**/*.stories.tsx", "**/*.test.*"],
      thresholds: { "src/lib/finance/**": { lines: 95, functions: 95, branches: 90 } },
    },
  },
});
