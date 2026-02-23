import dotenv from "dotenv";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { DbPoolType } from "../../../src/db/type.ts";
import * as schema from "../../../src/db/schemas/index.ts";
import { Pool } from "pg";
import { createRedisSessionStore, SessionStore } from "./redis-test.ts";
dotenv.config({ path: ".env.test" });

let databaseName: string;
export let testDb: DbPoolType;
let testPool: Pool;
export let redisDb: SessionStore;

export const startTestDb = async ({
  adminUrl,
  adminPool,
}: {
  adminUrl: string;
  adminPool: Pool;
}) => {
  databaseName = `test_${randomUUID()}`;
  await adminPool.query(`
  CREATE DATABASE "${databaseName}"
  TEMPLATE ${process.env.TEMPLATE_NAME}
`);

  redisDb = await createRedisSessionStore();

  const testDatabaseUrl = adminUrl.replace(/\/[^/]+$/, `/${databaseName}`);
  process.env.DATABASE_URL = testDatabaseUrl;

  testPool = new Pool({
    connectionString: testDatabaseUrl,
  });

  testDb = drizzle(testPool, {
    schema,
    logger: false,
  });
};

export const stopTestDb = async ({ adminPool }: { adminPool: Pool }) => {
  testPool.end();
  await adminPool.query(`DROP DATABASE IF EXISTS "${databaseName}"`);
  // await redisDb.flushDb();
  // await redisDb.quit();
};
