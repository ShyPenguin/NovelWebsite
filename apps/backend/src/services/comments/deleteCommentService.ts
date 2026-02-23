import { eq } from "drizzle-orm";
import { CommentTable } from "../../db/schemas/comments.ts";
import { ServiceResult } from "../../types/index.ts";
import { db } from "../../db/index.ts";

export const deleteCommentService = async (
  id: string
): Promise<ServiceResult<typeof CommentTable.$inferSelect>> => {
  try {
    const result = await db
      .delete(CommentTable)
      .where(eq(CommentTable.id, id))
      .returning();

    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Comment does not exist",
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
