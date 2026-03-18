import { defineConfig } from "drizzle-kit";
import { baseConfig } from "./drizzle.base";
import dotenv from "dotenv";

dotenv.config({ path: ".env.staging" });

export default defineConfig({
  ...baseConfig,
  out: "./src/infrastructure/db/migrations/staging",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
