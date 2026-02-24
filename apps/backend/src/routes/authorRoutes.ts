import { Router } from "express";
import { authorizeRole } from "../middlewares/authorizeRole.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import {
  deleteAuthorController,
  putAuthorController,
} from "../controllers/authorControllers/index.ts";
import { idSchema } from "../validations/fields.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getAuthorsController } from "@/controllers/authorControllers/get-authors-controller.ts";
import { getAuthorOneController } from "@/controllers/authorControllers/get-author-one-controller.ts";
import { postAuthorController } from "@/controllers/authorControllers/post-author-controller.ts";
import { AuthorQuerySchema } from "@/validations/AuthorValidator.ts";
import { AuthorFormSchema } from "@repo/contracts/schemas/author";

const authorRoutes = Router();

authorRoutes.get(
  "/",
  validateMiddleware(AuthorQuerySchema, "query"),
  asyncHandler(getAuthorsController({ type: "detail" })),
);
authorRoutes.post(
  "/",
  asyncHandler(authMiddleware),
  authorizeRole(["admin", "staff"], "create", "author"),
  validateMiddleware(AuthorFormSchema, "body"),
  asyncHandler(postAuthorController),
);
authorRoutes.get(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(getAuthorOneController),
);
authorRoutes.delete(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(authMiddleware),
  authorizeRole(["admin"], "delete", "author"),
  asyncHandler(deleteAuthorController),
);
authorRoutes.put(
  "/:id",
  validateMiddleware(idSchema, "params"),
  validateMiddleware(AuthorFormSchema, "body"),
  asyncHandler(authMiddleware),
  authorizeRole(["admin"], "update", "author"),
  asyncHandler(putAuthorController),
);
export default authorRoutes;
