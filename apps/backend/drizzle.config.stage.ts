import { defineConfig } from "drizzle-kit";
import { baseConfig } from "./drizzle.base";
import dotenv from "dotenv";
dotenv.config({ path: ".env.stage", override: true });

export default defineConfig({
  ...baseConfig,
  out: "./src/infrastructure/db/migrations/stage",
  dbCredentials: {
    url: `${process.env.DATABASE_URL!}`,
  },
});
