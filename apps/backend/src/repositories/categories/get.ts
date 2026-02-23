import { CategoryTable } from "../../db/schemas/index.ts";
import { inArray } from "drizzle-orm";
import { Transaction } from "../../db/type.ts";

export const getCategoriesByIdsTx = async (
  trx: Transaction,
  categoryIds: string[]
): Promise<(typeof CategoryTable.$inferSelect)[]> => {
  if (!categoryIds.length) return [];

  return trx
    .select()
    .from(CategoryTable)
    .where(inArray(CategoryTable.id, categoryIds));
};
