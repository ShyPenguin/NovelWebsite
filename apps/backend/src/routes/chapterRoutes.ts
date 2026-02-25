import { Router } from "express";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { idSchema } from "../validations/fields.ts";
import {
  deleteChapterController,
  getChapterOneController,
  putChapterController,
} from "../controllers/chapterControllers/index.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { authorizeRole } from "../middlewares/authorizeRole.ts";
import { getCommentsController } from "../controllers/commentsControllers/index.ts";
import {
  CommentFormSchema,
  CommentQuerySchema,
} from "../validations/CommentValidator.ts";
import { postCommentController } from "../controllers/commentsControllers/postCommentController.ts";
import { getLatestChaptersController } from "../controllers/chapterControllers/getLatestChaptersController.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ChapterFormSchema } from "@repo/contracts/schemas/chapter";

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

chapterRoutes.get(
  "/:id/comments",
  validateMiddleware(idSchema, "params"),
  validateMiddleware(CommentQuerySchema, "query"),
  asyncHandler(getCommentsController),
);

chapterRoutes.post(
  "/:id/comments",
  validateMiddleware(idSchema, "params"),
  asyncHandler(authMiddleware),
  validateMiddleware(CommentFormSchema, "body"),
  asyncHandler(postCommentController({ reply: false })),
);

export default chapterRoutes;
