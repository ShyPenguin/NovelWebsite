import { Router } from "express";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { idSchema } from "../validations/fields.ts";
import {
  deleteCommentController,
  getRepliesController,
  postCommentController,
} from "../controllers/commentsControllers/index.ts";
import {
  CommentFormSchema,
  CommentQuerySchema,
} from "../validations/CommentValidator.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { permitMiddleware } from "../middlewares/permitMiddleware.ts";
import { getCommentOneService } from "../services/comments/getCommentOneService.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const commentRoutes = Router();

commentRoutes.get(
  "/:id",
  validateMiddleware(idSchema, "params"),
  validateMiddleware(CommentQuerySchema, "query"),
  asyncHandler(getRepliesController),
);

commentRoutes.post(
  "/:id",
  validateMiddleware(idSchema, "params"),
  authMiddleware,
  validateMiddleware(CommentFormSchema, "body"),
  asyncHandler(postCommentController({ reply: true })),
);

commentRoutes.delete(
  "/:id",
  validateMiddleware(idSchema, "params"),
  authMiddleware,
  permitMiddleware({
    method: "delete",
    resource: "comment",
    fetchResource: getCommentOneService,
    ownershipField: "userId",
    allowedRolesToSkip: ["admin", "staff"],
  }),
  asyncHandler(deleteCommentController),
);
export default commentRoutes;
