import dotenv from "dotenv";
import { Client } from "pg";
import { execSync } from "node:child_process";
import { waitForDb } from "../scripts/wait-for-db.ts";
dotenv.config({ path: ".env.test" });

const { DATABASE_ADMIN_URL, DATABASE_TEMPLATE_URL, TEMPLATE_NAME } =
  process.env;
if (!DATABASE_ADMIN_URL || !DATABASE_TEMPLATE_URL || !TEMPLATE_NAME) {
  throw new Error("Missing required env vars");
}

const main = async () => {
  await waitForDb({
    databaseUrl: DATABASE_ADMIN_URL,
    redisUrl: process.env.REDIS_URL,
    workerId: Number(process.env.VITEST_WORKER_ID ?? 0),
  });
  const admin = new Client({
    connectionString: DATABASE_ADMIN_URL,
  });

  await admin.connect();

  console.log(`🔄 Rebuilding template: ${TEMPLATE_NAME}`);

  try {
    await admin.query(`ALTER DATABASE "${TEMPLATE_NAME}" IS_TEMPLATE false`);
  } catch (error) {
    // Database might not exist or already not a template
    console.log("Database not found or not a template, continuing...");
  }

  await admin.query(`DROP DATABASE IF EXISTS "${TEMPLATE_NAME}"`);
  await admin.query(`CREATE DATABASE "${TEMPLATE_NAME}"`);

  await admin.end();

  console.log("📦 Running Drizzle migrations");

  execSync(
    `dotenv -v DATABASE_URL=${DATABASE_TEMPLATE_URL} npm run db:migrate`,
    {
      stdio: "inherit",
    },
  );

  const admin2 = new Client({
    connectionString: DATABASE_ADMIN_URL,
  });

  await admin2.connect();

  await admin2.query(`
    ALTER DATABASE "${TEMPLATE_NAME}" IS_TEMPLATE true
  `);

  await admin2.end();

  console.log("✅ Template ready");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
