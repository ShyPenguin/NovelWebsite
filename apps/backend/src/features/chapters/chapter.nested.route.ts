import { asyncHandler } from "@/shared/utils/async-handler.js";
import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth-middleware.js";
import { validateMiddleware } from "@/middlewares/validate-middleware.js";
import { ChapterFormSchema } from "@repo/contracts/schemas/chapter";
import { idSchema } from "@repo/contracts/schemas/id";
import { ChapterQuerySchema } from "./chapter.schema.js";
import { getChaptersController } from "./controllers/get-chapters.controller.js";
import { postChapterController } from "./controllers/post-chapter.controller.js";
import { previewChapterController } from "./controllers/preview-chapter.controller.js";
import { getChapterOneByNumberController } from "./controllers/get-chapter-one-by-number.controller.js";

const chapterNestedRoutes = Router();

chapterNestedRoutes.post(
  "/:id/chapters",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ChapterFormSchema, "body"),
  asyncHandler(postChapterController),
);

chapterNestedRoutes.post(
  "/:id/chapters/preview",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ChapterFormSchema, "body"),
  asyncHandler(previewChapterController),
);

// Only Thumbnails
chapterNestedRoutes.get(
  "/:id/chapters",
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ChapterQuerySchema, "query"),
  asyncHandler(getChaptersController({ type: "thumbnail" })),
);

chapterNestedRoutes.get(
  "/:id/chapters/chapter-:chapterNumber",
  asyncHandler(getChapterOneByNumberController),
);
export default chapterNestedRoutes;
