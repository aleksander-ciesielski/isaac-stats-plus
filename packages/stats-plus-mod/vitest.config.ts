import { defineProject } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// eslint-disable-next-line import/no-default-export
export default defineProject({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    setupFiles: [
      "./src/testing/setup/reset.js",
      "./src/testing/setup/logger.js",
      "isaac-lua-polyfill",
    ],
  },
});
