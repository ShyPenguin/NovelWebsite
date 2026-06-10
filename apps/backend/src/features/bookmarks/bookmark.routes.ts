import { asyncHandler } from "@/shared/utils/async-handler.js";
import { Router } from "express";
import { getBookmarksController } from "./controllers/get-bookmarks.controller.js";
import { authMiddleware } from "@/middlewares/auth-middleware.js";
import { deleteBookmarkController } from "./controllers/delete-bookmark.controller.js";

const bookmarkRoutes = Router();

bookmarkRoutes.get(
  "/",
  asyncHandler(authMiddleware),
  asyncHandler(getBookmarksController),
);

bookmarkRoutes.delete(
  "/:novelId",
  asyncHandler(authMiddleware),
  asyncHandler(deleteBookmarkController),
);

export default bookmarkRoutes;
