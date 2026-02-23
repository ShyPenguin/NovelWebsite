import type { ExtractTablesWithRelations } from "drizzle-orm";
import type {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import type * as schema from "./schemas/index.ts";
import type { Client, Pool } from "pg";

export type Transaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export type DbBaseType<T> = NodePgDatabase<typeof schema> & {
  $client: T;
};

export type DbPoolType = DbBaseType<Pool>;
export type DbClientType = DbBaseType<Client>;
export type DbExecTypes = DbPoolType | DbClientType | Transaction;
