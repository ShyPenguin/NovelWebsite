import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schemas/index.ts";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema,
  logger: false,
});

type Schema = typeof schema;
export type TableNameFromSchema = {
  [K in keyof Schema]: Schema[K] extends { _: { name: infer N extends string } }
    ? N
    : never;
}[keyof Schema];
