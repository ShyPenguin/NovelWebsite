import { db } from "@/infrastructure/db/index.js";
import { sql } from "drizzle-orm";

async function resetDb() {
  await db.execute(sql`DROP SCHEMA public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);
}

resetDb();
