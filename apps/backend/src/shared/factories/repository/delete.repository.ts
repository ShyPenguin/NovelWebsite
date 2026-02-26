import { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm/table";
import { eq } from "drizzle-orm";
import { DbExecTypes } from "@/infrastructure/db/type.ts";

export const DeleteResourceFactory = <T extends PgTable, C extends PgColumn>({
  table,
  tableId,
}: {
  table: T;
  tableId: C;
}) => {
  type SelectType = InferSelectModel<T>;

  return async ({
    tx,
    id,
  }: {
    tx: DbExecTypes;
    id: string;
  }): Promise<SelectType> => {
    const result = await tx.delete(table).where(eq(tableId, id)).returning();
    return result[0] as SelectType;
  };
};
