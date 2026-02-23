import { InferSelectModel } from "drizzle-orm";
import { NovelTable, ReviewTable } from "../../db/schemas/index.ts";
import { ServiceResult } from "../../types/index.ts";
import { db } from "../../db/index.ts";
import { eq } from "drizzle-orm";

type ReviewWithTranslator = Pick<
  InferSelectModel<typeof ReviewTable>,
  | "id"
  | "novelId"
  | "reviewerId"
  | "rating"
  | "review"
  | "createdAt"
  | "updatedAt"
> & {
  translatorId: InferSelectModel<typeof NovelTable>["translatorId"];
};
export const getReviewOneService = async (
  id: string
): Promise<ServiceResult<ReviewWithTranslator>> => {
  try {
    const result = await db
      .select({
        id: ReviewTable.id,
        novelId: ReviewTable.novelId,
        reviewerId: ReviewTable.reviewerId,
        rating: ReviewTable.rating,
        review: ReviewTable.review,
        createdAt: ReviewTable.createdAt,
        updatedAt: ReviewTable.updatedAt,
        translatorId: NovelTable.translatorId,
      })
      .from(ReviewTable)
      .where(eq(ReviewTable.id, id))
      .leftJoin(NovelTable, eq(ReviewTable.novelId, NovelTable.id));

    if (result.length < 1) {
      return {
        success: false,
        type: "database",
        message: "Review does not exist",
      };
    }

    return { success: true, data: result[0] };
  } catch (err) {
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};
