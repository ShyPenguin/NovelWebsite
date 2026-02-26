import { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm/table";
import { eq } from "drizzle-orm";
import { DbExecTypes } from "@/infrastructure/db/type.ts";

export const UpdateResourceFactory = <T extends PgTable>({
  table,
  tableId,
}: {
  table: T;
  tableId: PgColumn;
}) => {
  type InsertType = Partial<InferInsertModel<T>>;
  type SelectType = InferSelectModel<T>;

  return async ({
    tx,
    form,
    id,
  }: {
    tx: DbExecTypes;
    form: InsertType;
    id: string;
  }): Promise<SelectType> => {
    const result = await tx
      .update(table)
      .set({ ...form, updatedAt: new Date() })
      .where(eq(tableId, id))
      .returning();

    // For some reason typescript thinks it should return result itself
    // when we know it retuns an array instead of a single object
    //@ts-expect-error
    return result[0] as SelectType;
  };
};
