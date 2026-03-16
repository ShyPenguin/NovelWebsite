import { Router } from "express";
import { NovelFormSchema } from "@repo/contracts/schemas/novel";
import { ChapterFormSchema } from "@repo/contracts/schemas/chapter";
import { getChaptersController } from "@/features/chapters/controllers/get-chapters.controller.js";
import { postChapterController } from "@/features/chapters/controllers/post-chapter.controller.js";
import { previewChapterController } from "@/features/chapters/controllers/preview-chapter.controller.js";
import { deleteNovelController } from "@/features/novels/controllers/delete-novel.controller.js";
import { getNovelOneController } from "@/features/novels/controllers/get-novel-one.controller.js";
import { getNovelsController } from "@/features/novels/controllers/get-novels.controller.js";
import { patchNovelCoverController } from "@/features/novels/controllers/patch-novel-cover.controller.js";
import { postNovelController } from "@/features/novels/controllers/post-novel.controller.js";
import { putNovelController } from "@/features/novels/controllers/put-novel.controller.js";
import { authMiddleware } from "@/middlewares/auth-middleware.js";
import { upload } from "@/middlewares/upload.js";
import { validateMiddleware } from "@/middlewares/validate-middleware.js";
import { ChapterQuerySchema } from "@/features/chapters/chapter.schema.js";
import { NovelQuerySchema } from "@/features/novels/novel.schema.js";
import { idSchema } from "@repo/contracts/schemas/id";
import { asyncHandler } from "@/shared/utils/async-handler.js";

const novelRoutes = Router();

novelRoutes.get(
  "/",
  validateMiddleware(NovelQuerySchema, "query"),
  asyncHandler(getNovelsController({ type: "detail" })),
);
novelRoutes.get(
  "/thumbnail",
  validateMiddleware(NovelQuerySchema, "query"),
  asyncHandler(getNovelsController({ type: "thumbnail" })),
);
novelRoutes.get(
  "/trend",
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

export default novelRoutes;
