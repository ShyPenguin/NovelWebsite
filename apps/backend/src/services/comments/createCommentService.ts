import { eq, InferInsertModel } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { CommentTable } from "../../db/schemas/index.ts";
import { ServiceResult } from "../../types/index.ts";

type commentInputType = {
  comment: typeof CommentTable.$inferSelect.comment;
  userId: typeof CommentTable.$inferSelect.userId;
  parentId?: typeof CommentTable.$inferSelect.parentId;
  chapterId?: typeof CommentTable.$inferSelect.chapterId;
};

type commentInsertType = {
  comment: typeof CommentTable.$inferSelect.comment;
  userId: typeof CommentTable.$inferSelect.userId;
  parentId?: typeof CommentTable.$inferSelect.parentId;
  chapterId: typeof CommentTable.$inferSelect.chapterId; // Now required
};

export const createCommentService = async (
  comment: commentInputType
): Promise<ServiceResult<typeof CommentTable.$inferSelect>> => {
  try {
    const result = await db.transaction(async (trx) => {
      let commentInput = comment;
      if (!comment.chapterId) {
        const commentParent = await trx
          .select()
          .from(CommentTable)
          .where(eq(CommentTable.id, comment.parentId as string));

        commentInput = {
          ...comment,
          chapterId: commentParent[0].chapterId as string,
        };
      }

      const commentResult = await trx
        .insert(CommentTable)
        .values(commentInput as commentInsertType)
        .returning();

      return {
        ...commentResult[0],
      };
    });

    if (!result) {
      return {
        type: "database",
        success: false,
        message: "Internal Server Error",
      };
    }

    return { success: true, data: result }; // Return the newly created user
  } catch (err: any) {
    console.log(err);
    if (err.code === "23503" && err.detail?.includes("novelId")) {
      return {
        type: "database",
        success: false,
        message: "Novel does not exist",
      };
    }
    if (err.code === "23503" && err.detail?.includes("userId")) {
      return {
        type: "database",
        success: false,
        message: "User does not exist",
      };
    }
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
