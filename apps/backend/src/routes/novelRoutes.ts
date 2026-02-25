import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { authorizeRole } from "../middlewares/authorizeRole.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import {
  postNovelController,
  getNovelsController,
  getNovelOneController,
  deleteNovelController,
  putNovelController,
  patchNovelCoverController,
} from "../controllers/novelControllers/index.ts";
import { idSchema } from "../validations/fields.ts";
import { ChapterQuerySchema } from "../validations/ChapterValidator.ts";
import {
  getChaptersController,
  postChapterController,
} from "../controllers/chapterControllers/index.ts";
import {
  ReviewFormSchema,
  ReviewQuerySchema,
} from "../validations/ReviewValidator.ts";
import {
  getReviewsController,
  postReviewController,
} from "../controllers/reviewControllers/index.ts";
import { previewChapterController } from "../controllers/chapterControllers/previewChapterController.ts";
import { upload } from "../middlewares/upload.ts";
import { NovelFormSchema } from "@repo/contracts/schemas/novel";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { NovelQuerySchema } from "../validations/NovelValidator.ts";
import { ChapterFormSchema } from "@repo/contracts/schemas/chapter";

const novelRoutes = Router();

novelRoutes.get(
  "/",
  validateMiddleware(NovelQuerySchema, "query"),
  asyncHandler(getNovelsController({ type: "detail" })),
);
novelRoutes.get(
  "/thumbnails",
  validateMiddleware(NovelQuerySchema, "query"),
  asyncHandler(getNovelsController({ type: "thumbnail" })),
);
novelRoutes.get(
  "/trends",
  validateMiddleware(NovelQuerySchema, "query"),
  asyncHandler(getNovelsController({ type: "trend" })),
);

novelRoutes.get(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(getNovelOneController),
);

novelRoutes.post(
  "/",
  asyncHandler(authMiddleware),
  validateMiddleware(NovelFormSchema, "body"),
  asyncHandler(postNovelController),
);

novelRoutes.put(
  "/:id",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  validateMiddleware(NovelFormSchema, "body"),
  asyncHandler(putNovelController),
);

novelRoutes.delete(
  "/:id",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  asyncHandler(deleteNovelController),
);

// NOVEL COVERS
novelRoutes.patch(
  "/:id/cover",
  asyncHandler(authMiddleware),
  authorizeRole(["admin", "staff"], "update", "images"),
  validateMiddleware(idSchema, "params"),
  upload.single("image"),
  asyncHandler(patchNovelCoverController),
);

// CHAPTERS
novelRoutes.post(
  "/:id/chapters",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ChapterFormSchema, "body"),
  asyncHandler(postChapterController),
);

novelRoutes.post(
  "/:id/chapters/preview",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ChapterFormSchema, "body"),
  asyncHandler(previewChapterController),
);

// Only Thumbnails
novelRoutes.get(
  "/:id/chapters",
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ChapterQuerySchema, "query"),
  asyncHandler(getChaptersController({ type: "thumbnail" })),
);

// REVIEWS
novelRoutes.post(
  "/:id/reviews",
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ReviewFormSchema, "body"),
  asyncHandler(authMiddleware),
  asyncHandler(postReviewController),
);

novelRoutes.get(
  "/:id/reviews",
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ReviewQuerySchema, "query"),
  asyncHandler(getReviewsController),
);

export default novelRoutes;
