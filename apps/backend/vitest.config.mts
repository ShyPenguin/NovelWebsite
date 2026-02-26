import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["**/*.unit.test.ts"],
          setupFiles: [],
          alias: {
            "@/": new URL("./src/", import.meta.url).pathname,
            "tests/": new URL("./tests/", import.meta.url).pathname,
          },
        },
      },
      {
        test: {
          name: { label: "integration", color: "green" },
          include: ["**/*.int.test.ts"],
          setupFiles: ["./tests/integrated/setup/index.ts"],
          testTimeout: 60_000,
          maxWorkers: 16,
          alias: {
            "@/": new URL("./src/", import.meta.url).pathname,
            "tests/": new URL("./tests/", import.meta.url).pathname,
          },
        },
      },
    ],
  },
});
