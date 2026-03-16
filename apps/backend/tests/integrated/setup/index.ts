import { startTestDb, stopTestDb } from "../db/db-test.js";
import { getAdminPool } from "../db/admin-test.js";

const { DATABASE_ADMIN_URL } = process.env;
if (!DATABASE_ADMIN_URL) {
  throw new Error("Missing required env vars");
}

const adminPool = getAdminPool();
await startTestDb({ adminUrl: DATABASE_ADMIN_URL, adminPool });

// cleanup per worker
process.on("exit", async () => {
  await stopTestDb({ adminPool });
});
