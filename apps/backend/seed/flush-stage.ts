import { db } from "@/infrastructure/db/index.js";
import { sql } from "drizzle-orm";

await db.execute(sql`
TRUNCATE TABLE chapters, novels, authors, categories RESTART IDENTITY CASCADE;
`);

// await db.execute(sql`
//   DROP TABLE IF EXISTS novels CASCADE;
// `);

// await db.execute(sql`
//   DROP TABLE IF EXISTS authors CASCADE;
// `);

// await db.execute(sql`
//   DROP TABLE IF EXISTS categories CASCADE;
// `);
