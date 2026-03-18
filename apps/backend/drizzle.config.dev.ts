import { defineConfig } from "drizzle-kit";
import { baseConfig } from "./drizzle.base";
import "dotenv/config";

export default defineConfig({
  ...baseConfig,
  out: "./src/infrastructure/db/migrations/dev",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
