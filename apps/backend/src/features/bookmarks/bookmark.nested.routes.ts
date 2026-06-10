import { authMiddleware } from "@/middlewares/auth-middleware.js";
import { asyncHandler } from "@/shared/utils/async-handler.js";
import { Router } from "express";
import { postBookmarkController } from "./controllers/post-bookmark.controller.js";

const bookmarkNestedRoute = Router();

bookmarkNestedRoute.post(
  "/:id/bookmarks",
  asyncHandler(authMiddleware),
  asyncHandler(postBookmarkController),
);

export default bookmarkNestedRoute;
