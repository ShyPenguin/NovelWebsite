import { ReviewTable } from "../../db/schemas/index.ts";
import { ServiceResult } from "../../types/index.ts";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";

export const updateReviewService = async (
  reviewData: Partial<typeof ReviewTable.$inferInsert>,
  id: string
): Promise<ServiceResult<typeof ReviewTable.$inferSelect>> => {
  try {
    const result = await db
      .update(ReviewTable)
      .set({
        ...reviewData,
        updatedAt: new Date(), // Always update timestamp
      })
      .where(eq(ReviewTable.id, id))
      .returning();

    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Review does not exist",
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
