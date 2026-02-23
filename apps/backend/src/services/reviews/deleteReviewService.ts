import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { ReviewTable } from "../../db/schemas/index.ts";
import { ServiceResult } from "../../types/index.ts";

export const deleteReviewService = async (
  id: string
): Promise<ServiceResult<typeof ReviewTable.$inferSelect>> => {
  try {
    const result = await db
      .delete(ReviewTable)
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
  } catch (err) {
    console.error(err);
    return {
      type: "unknown",
      success: false,
      message: "Internal Server Error",
    };
  }
};
