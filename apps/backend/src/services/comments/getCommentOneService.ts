import { eq, sql, asc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { CommentTable } from "../../db/schemas/comments.ts";
import { ServiceResult } from "../../types/index.ts";

export const getCommentOneService = async (
  id: string
): Promise<ServiceResult<any>> => {
  try {
    const comment = await db
      .select()
      .from(CommentTable)
      .where(eq(CommentTable.id, id));

    if (comment.length < 1) {
      return {
        type: "database",
        success: false,
        message: "Comment does not exist",
      };
    }

    return {
      success: true,
      data: comment[0],
    };
  } catch (err: any) {
    if (err.code === "23503" && err.detail?.includes("parentId")) {
      return {
        type: "database",
        success: false,
        message: "Comment does not exist",
      };
    }
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};
