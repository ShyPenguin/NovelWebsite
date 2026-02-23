import { eq, sql } from "drizzle-orm";
import { PAGE_SIZE } from "../../constants/index.ts";
import { NovelTable, ReviewTable } from "../../db/schemas/index.ts";
import { ServiceResult } from "../../types/index.ts";
import { parseSortQuery } from "../../utils/parseSortQuery.ts";
import { db } from "../../db/index.ts";

const sortableColumns = {
  rating: ReviewTable.rating,
  createdAt: ReviewTable.createdAt,
  updatedAt: ReviewTable.updatedAt,
  // add more if needed
};

export const getReviewsService = async (
  query: Record<string, any>,
  page: number | 1,
  select?: Record<string, any>
): Promise<ServiceResult<any>> => {
  const sortOrder = parseSortQuery({
    sortParam: query.sort ? query.sort : "desc(rating)",
    sortableColumns: sortableColumns,
  }); // e.g. "desc(rating),asc(createdAt)"

  try {
    const { reviews, totalResult, novel } = await db.transaction(
      async (trx) => {
        const base = select
          ? trx.select(select as Record<string, any>)
          : trx.select();

        const baseQuery = base
          .from(ReviewTable)
          .where(eq(ReviewTable.novelId, query.novelId))
          .limit(PAGE_SIZE)
          .offset((page - 1) * PAGE_SIZE)
          .orderBy(...sortOrder);

        const countQuery = trx
          .select({ count: sql<number>`count(*)` })
          .from(ReviewTable)
          .where(eq(ReviewTable.novelId, query.novelId));

        const baseResult = await baseQuery;
        const countResult = await countQuery;
        const novel = await trx
          .select()
          .from(NovelTable)
          .where(eq(NovelTable.id, query.novelId));

        return {
          reviews: baseResult,
          totalResult: countResult,
          novel: novel,
        };
      }
    );

    if (!novel[0]) {
      return {
        type: "database",
        success: false,
        message: "Novel does not exist",
      };
    }
    const total = Number(totalResult[0]?.count) ?? 0;

    if (reviews.length < 1) {
      return {
        success: false,
        type: "database",
        message: "Empty Data",
      };
    }
    const totalPage = Math.ceil(total / PAGE_SIZE);
    return {
      success: true,
      data: { reviews, currentPage: page, totalPage },
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
