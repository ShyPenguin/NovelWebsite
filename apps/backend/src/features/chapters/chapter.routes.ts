import { Router } from "express";
import { ChapterFormSchema } from "@repo/contracts/schemas/chapter";
import { getLatestChaptersController } from "@/features/chapters/controllers/get-latest-chapters.controller.js";
import { authMiddleware } from "@/middlewares/auth-middleware.js";
import { validateMiddleware } from "@/middlewares/validate-middleware.js";
import { asyncHandler } from "@/shared/utils/async-handler.js";
import { deleteChapterController } from "./controllers/delete-chapter.controller.js";
import { getChapterOneController } from "./controllers/get-chapter-one.controller.js";
import { putChapterController } from "./controllers/put-chapter.controller.js";
import { idSchema } from "@repo/contracts/schemas/id";

const chapterRoutes = Router();

chapterRoutes.get(
  "/allLatestChapters",
  asyncHandler(getLatestChaptersController),
);

chapterRoutes.get(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(getChapterOneController),
);

chapterRoutes.delete(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(authMiddleware),
  asyncHandler(deleteChapterController),
);

chapterRoutes.put(
  "/:id",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ChapterFormSchema, "body"),
  asyncHandler(putChapterController),
);

export default chapterRoutes;
