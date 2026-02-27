import { Router } from "express";
import { NovelFormSchema } from "@repo/contracts/schemas/novel";
import { ChapterFormSchema } from "@repo/contracts/schemas/chapter";
import { getChaptersController } from "@/features/chapters/controllers/get-chapters.controller.ts";
import { postChapterController } from "@/features/chapters/controllers/post-chapter.controller.ts";
import { previewChapterController } from "@/features/chapters/controllers/preview-chapter.controller.ts";
import { deleteNovelController } from "@/features/novels/controllers/delete-novel.controller.ts";
import { getNovelOneController } from "@/features/novels/controllers/get-novel-one.controller.ts";
import { getNovelsController } from "@/features/novels/controllers/get-novels.controller.ts";
import { patchNovelCoverController } from "@/features/novels/controllers/patch-novel-cover.controller.ts";
import { postNovelController } from "@/features/novels/controllers/post-novel.controller.ts";
import { putNovelController } from "@/features/novels/controllers/put-novel.controller.ts";
import { authMiddleware } from "@/middlewares/auth-middleware.ts";
import { upload } from "@/middlewares/upload.ts";
import { validateMiddleware } from "@/middlewares/validate-middleware.ts";
import { ChapterQuerySchema } from "@/features/chapters/chapter.schema.ts";
import { NovelQuerySchema } from "@/features/novels/novel.schema..ts";
import { idSchema } from "@repo/contracts/schemas/id";
import { asyncHandler } from "@/shared/utils/async-handler.ts";

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
