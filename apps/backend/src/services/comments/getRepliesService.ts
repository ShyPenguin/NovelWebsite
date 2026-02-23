import { eq, sql, asc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { CommentTable } from "../../db/schemas/comments.ts";
import { ServiceResult } from "../../types/index.ts";
import { alias } from "drizzle-orm/pg-core";
import { COMMENT_PAGE_SIZE } from "../../constants/index.ts";
import { UserTable } from "../../db/schemas/index.ts";

export const getRepliesService = async (
  id: string,
  page: number | 1
): Promise<ServiceResult<any>> => {
  try {
    const children = alias(CommentTable, "children");

    const { comments, count, comment } = await db.transaction(async (trx) => {
      const comment = await trx
        .select()
        .from(CommentTable)
        .where(eq(CommentTable.id, id));

      const comments = await trx
        .select({
          id: CommentTable.id,
          userId: CommentTable.userId,
          user: {
            username: UserTable.username,
            name: UserTable.name,
            email: UserTable.email,
            role: UserTable.role,
          },
          chapterId: CommentTable.chapterId,
          parentId: CommentTable.parentId,
          comment: CommentTable.comment,
          createdAt: CommentTable.createdAt,
          repliesCount: sql<number>`COUNT(children.id)`.as("repliesCount"),
        })
        .from(CommentTable)
        .where(eq(CommentTable.parentId, id))
        .leftJoin(UserTable, eq(CommentTable.userId, UserTable.id))
        .leftJoin(children, eq(children.parentId, CommentTable.id))
        .groupBy(CommentTable.id, UserTable.id)
        .limit(COMMENT_PAGE_SIZE)
        .offset((page - 1) * COMMENT_PAGE_SIZE)
        .orderBy(asc(CommentTable.createdAt));

      const count = await trx
        .select({
          count: sql<number>`COUNT(*)`,
        })
        .from(CommentTable)
        .where(eq(CommentTable.parentId, id));

      return {
        comments,
        count,
        comment,
      };
    });

    if (!comment[0]) {
      return {
        type: "database",
        success: false,
        message: "Comment does not exist",
      };
    }

    if (comments.length < 1) {
      return {
        success: false,
        type: "database",
        message: "Empty Data",
      };
    }

    const total = Number(count[0]?.count) ?? 0;
    const totalPage = Math.ceil(total / COMMENT_PAGE_SIZE);

    return {
      success: true,
      data: { comments, currentPage: page, totalPage },
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
