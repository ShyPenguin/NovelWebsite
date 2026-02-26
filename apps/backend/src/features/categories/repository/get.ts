import { CategoryTable } from "@/infrastructure/db/schemas/categories.ts";
import { Transaction } from "@/infrastructure/db/type.ts";
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
