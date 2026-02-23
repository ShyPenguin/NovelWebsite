import { SQL, sql, eq, ilike, isNull, desc, asc } from "drizzle-orm";
import { ServiceResult } from "../../types/index.ts";
import { db } from "../../db/index.ts";
import { applyWhere } from "../../utils/applyWhere.ts";
import { COMMENT_PAGE_SIZE } from "../../constants/index.ts";
import { ChapterTable } from "../../db/schemas/chapters.ts";
import { CommentTable } from "../../db/schemas/comments.ts";
import { alias } from "drizzle-orm/pg-core";
import { UserTable } from "../../db/schemas/users.ts";

export const getCommentsService = async (
  query: Record<string, any>,
  page: number | 1,
  select?: Record<string, any>
): Promise<ServiceResult<any>> => {
  try {
    const children = alias(CommentTable, "children");

    const selectInput = select
      ? select
      : {
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
        };
    const { andFilters, orFilters, baseQuery } = preparingQuery(
      query,
      page,
      selectInput
    );

    const { baseQuery: countQuery } = preparingQuery(query, page, {
      count: sql<number>`count(*)`,
    });

    applyWhere({ q: baseQuery, orFilters, andFilters });
    applyWhere({ q: countQuery, orFilters, andFilters });

    const commentsPromise = baseQuery
      .leftJoin(UserTable, eq(CommentTable.userId, UserTable.id))
      .leftJoin(children, eq(children.parentId, CommentTable.id))
      .groupBy(CommentTable.id, UserTable.id)
      .limit(COMMENT_PAGE_SIZE)
      .offset((page - 1) * COMMENT_PAGE_SIZE)
      .orderBy(asc(CommentTable.createdAt));

    const [comments, totalResult, chapter] = await Promise.all([
      commentsPromise,
      countQuery,
      db
        .select()
        .from(ChapterTable)
        .where(eq(ChapterTable.id, query.chapterId)),
    ]);

    if (!chapter[0]) {
      return {
        type: "database",
        success: false,
        message: "Chapter does not exist",
      };
    }
    const total = Number(totalResult[0]?.count) ?? 0;

    if (comments.length < 1) {
      return {
        success: false,
        type: "database",
        message: "Empty Data",
      };
    }

    const totalPage = Math.ceil(total / COMMENT_PAGE_SIZE);
    return {
      success: true,
      data: { comments, currentPage: page, totalPage },
    };
  } catch (err: any) {
    console.log(err);
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};

export const preparingQuery = (
  query: Record<string, any>,
  page: number | 1,
  select?: Record<string, any>
): {
  andFilters: SQL[];
  orFilters: SQL[];
  baseQuery: any;
} => {
  const andFilters: SQL[] = [];
  const orFilters: SQL[] = [];
  const shouldUseSelectArg = select && Object.keys(select).length > 0;

  const base = shouldUseSelectArg
    ? db.select(select as Record<string, any>)
    : db.select();

  let baseQuery = base.from(CommentTable);

  if (query.comment) {
    orFilters.push(ilike(CommentTable.comment, `%${query.comment}%`));
  }

  // Example: chapterId must match exactly → AND
  if (query.chapterId) {
    andFilters.push(eq(CommentTable.chapterId, query.chapterId));
  }

  andFilters.push(isNull(CommentTable.parentId));

  return { andFilters, orFilters, baseQuery };
};
