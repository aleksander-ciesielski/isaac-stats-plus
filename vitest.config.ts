import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["html"],
      all: true,
    },
  },
});
