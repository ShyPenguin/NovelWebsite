import { db } from "../../db/index.ts";
import { NovelCategoryTable } from "../../db/schemas/index.ts";
import { ServiceResult } from "../../types/index.ts";

export const createNovelCategoryService = async (
  novelCategory: typeof NovelCategoryTable.$inferInsert,
): Promise<ServiceResult<typeof NovelCategoryTable.$inferSelect>> => {
  try {
    const result = await db
      .insert(NovelCategoryTable)
      .values(novelCategory)
      .returning();
    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Internal Server Error",
      };
    }
    return { success: true, data: result[0] }; // Return the newly created user
  } catch (err: any) {
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};
