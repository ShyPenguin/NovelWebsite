import { NovelCategoryTable } from "@/infrastructure/db/schemas/novel-categories.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { eq } from "drizzle-orm";

export const upsertNovelCategoriesTx = async (
  tx: DbExecTypes,
  novelId: string,
  categoryIds: string[],
) => {
  // Always delete first (replace-all semantics)
  await tx
    .delete(NovelCategoryTable)
    .where(eq(NovelCategoryTable.novelId, novelId));

  if (categoryIds.length === 0) {
    return [];
  }

  const uniqueCategoryIds = [...new Set(categoryIds)];

  const values = uniqueCategoryIds.map((categoryId) => ({
    novelId,
    categoryId,
  }));

  return tx.insert(NovelCategoryTable).values(values).returning();
};
