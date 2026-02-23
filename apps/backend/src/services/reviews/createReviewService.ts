import { db } from "../../db/index.ts";
import { ReviewTable } from "../../db/schemas/index.ts";
import { ServiceResult } from "../../types/index.ts";

export const createReviewService = async (
  review: typeof ReviewTable.$inferInsert,
): Promise<ServiceResult<typeof ReviewTable.$inferSelect>> => {
  try {
    const result = await db.insert(ReviewTable).values(review).returning();
    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Internal Server Error",
      };
    }

    return { success: true, data: result[0] }; // Return the newly created user
  } catch (err: any) {
    if (
      err.code === "23505" &&
      err.constraint === "unique_novel_reviewer_idx"
    ) {
      return {
        type: "validation",
        success: false,
        message: "You already submitted a review for this novel.",
      };
    }

    if (err.code === "23503" && err.detail?.includes("novelId")) {
      return {
        type: "database",
        success: false,
        message: "Novel does not exist",
      };
    }

    if (err.code === "23503" && err.detail?.includes("reviewerId")) {
      return {
        type: "validation",
        success: false,
        message: "User does not exist",
      };
    }
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};
