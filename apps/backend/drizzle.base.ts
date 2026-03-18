import type { Config } from "drizzle-kit";

export const baseConfig: Omit<Config, "dbCredentials"> = {
  schema: "./src/infrastructure/db/schemas/index.ts",
  dialect: "postgresql",
  verbose: true,
  strict: true,
};
