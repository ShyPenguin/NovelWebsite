import { createAuthorService } from "../../../src/services/authors/index.ts";
import { createCategoryService } from "../../../src/services/categories/index.ts";
import { createChapterService } from "../../../src/services/chapters/index.ts";
import { createNovelScheduleService } from "../../../src/services/novelSchedule/index.ts";
import { createNovelCategoryService } from "../../../src/services/novelCategories/index.ts";
import { createReviewService } from "../../../src/services/reviews/createReviewService.ts";
import { createCommentService } from "../../../src/services/comments/createCommentService.ts";
import { ServiceResult } from "../../../src/types/index.ts";

export function mockCreateFactory<T, U>(
  table: string,
  callback: (data: T) => Promise<ServiceResult<U>>,
): (inputData: T) => Promise<U | undefined> {
  return async (inputData: T): Promise<U | undefined> => {
    const result = await callback(inputData);
    if (!result.success) {
      console.log(result.message);
      console.log(`Mock create ${table} error`);
      return undefined;
    }
    return result.data;
  };
}

export const mockCreateNovelSchedule = mockCreateFactory(
  "NovelSchedule",
  createNovelScheduleService,
);

export const mockCreateAuthor = mockCreateFactory(
  "Author",
  createAuthorService,
);
export const mockCreateCategory = mockCreateFactory(
  "Category",
  createCategoryService,
);
export const mockCreateNovelCategory = mockCreateFactory(
  "Novel Category",
  createNovelCategoryService,
);
export const mockCreateChapter = mockCreateFactory(
  "Chapter",
  createChapterService,
);

export const mockCreateReview = mockCreateFactory(
  "Review",
  createReviewService,
);
export const mockCreateComment = mockCreateFactory(
  "Comment",
  createCommentService,
);
