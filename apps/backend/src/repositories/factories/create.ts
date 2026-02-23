import { PgTable } from "drizzle-orm/pg-core";
import type { DbExecTypes } from "../../db/type.ts";
import { InferInsertModel, InferSelectModel } from "drizzle-orm/table";

export const CreateResourceFactory = <T extends PgTable>({
  table,
}: {
  table: T;
}) => {
  type InsertType = InferInsertModel<T>;
  type SelectType = InferSelectModel<T>;

  return async ({
    tx,
    form,
  }: {
    tx: DbExecTypes;
    form: InsertType;
  }): Promise<SelectType> => {
    const result = await tx.insert(table).values(form).returning();
    return result[0] as SelectType;
  };
};
