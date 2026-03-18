import { defineConfig } from "drizzle-kit";
import { baseConfig } from "./drizzle.base";
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

export default defineConfig({
  ...baseConfig,
  out: "./src/infrastructure/db/migrations/dev",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
