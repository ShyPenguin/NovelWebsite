import { beforeEach, afterEach } from "vitest";
import { sql } from "drizzle-orm";
import { DbClientType, DbPoolType } from "../../../src/db/type.ts";

let tx: DbClientType | DbPoolType | null;

export const useTestTx = ({
  testDb,
}: {
  testDb: DbClientType | DbPoolType;
}) => {
  beforeEach(async () => {
    await testDb.execute(sql`BEGIN`);
    tx = testDb;
  });

  afterEach(async () => {
    if (tx) {
      await tx.execute(sql`ROLLBACK`);
      tx = null;
    }
  });

  return () => {
    if (!tx) throw new Error("Transaction not initialized");
    return tx;
  };
};
