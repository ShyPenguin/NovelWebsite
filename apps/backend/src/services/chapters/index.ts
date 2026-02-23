import { ChapterTable, getChapterColumns } from "../../db/schemas/chapters.ts";
import { ServiceResult } from "../../types/index.ts";
import { db } from "../../db/index.ts";
import { desc, eq } from "drizzle-orm";
export * from "./getChaptersService.ts";
export * from "./getChapterOneService.ts";
export * from "./previewChapterService.ts";

export const updateChapterService = async (
  chapterData: Partial<typeof ChapterTable.$inferInsert>,
  id: string,
): Promise<ServiceResult<typeof ChapterTable.$inferSelect>> => {
  try {
    const result = await db
      .update(ChapterTable)
      .set({
        ...chapterData,
        updatedAt: new Date(), // Always update timestamp
      })
      .where(eq(ChapterTable.id, id))
      .returning();

    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Chapter does not exist",
      };
    }
    return { success: true, data: result[0] }; // Return the newly created user
  } catch (err: any) {
    const message = "Internal Server Error";
    return {
      type: "unknown",
      success: false,
      message,
    };
  }
};
