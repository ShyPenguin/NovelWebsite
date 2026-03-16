import { CategoryTable } from "@/infrastructure/db/schemas/categories.js";
import { Transaction } from "@/infrastructure/db/type.js";
import { inArray } from "drizzle-orm";

export const getCategoriesByIdsTx = async (
  trx: Transaction,
  categoryIds: string[],
): Promise<(typeof CategoryTable.$inferSelect)[]> => {
  if (!categoryIds.length) return [];

  return trx
    .select()
    .from(CategoryTable)
    .where(inArray(CategoryTable.id, categoryIds));
};
