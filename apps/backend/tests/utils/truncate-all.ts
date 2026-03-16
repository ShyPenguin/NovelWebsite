import { sql } from "drizzle-orm";
import { testDb } from "../integrated/db/db-test.js";

export async function truncateAll() {
  await testDb.execute(sql`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN (
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
      )
      LOOP
        EXECUTE 'TRUNCATE TABLE public.' 
          || quote_ident(r.tablename) 
          || ' RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);
}
