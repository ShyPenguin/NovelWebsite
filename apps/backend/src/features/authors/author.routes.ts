import { Router } from "express";
import { AuthorQuerySchema } from "@/features/authors/author.schema.ts";
import { AuthorFormSchema } from "@repo/contracts/schemas/author";
import { authMiddleware } from "@/middlewares/auth-middleware.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import { validateMiddleware } from "@/middlewares/validate-middleware.ts";
import { deleteAuthorController } from "./controllers/delete-author.controller.ts";
import { getAuthorOneController } from "./controllers/get-author-one.controller.ts";
import { getAuthorsController } from "./controllers/get-authors.controller.ts";
import { postAuthorController } from "./controllers/post-author.controller.ts";
import { putAuthorController } from "./controllers/put-author.controller.ts";
import { idSchema } from "@repo/contracts/schemas/id";

const authorRoutes = Router();

authorRoutes.get(
  "/",
  validateMiddleware(AuthorQuerySchema, "query"),
  asyncHandler(getAuthorsController({ type: "thumbnail" })),
);
authorRoutes.get(
  "/detail",
  validateMiddleware(AuthorQuerySchema, "query"),
  asyncHandler(getAuthorsController({ type: "detail" })),
);
authorRoutes.post(
  "/",
  asyncHandler(authMiddleware),
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
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  asyncHandler(deleteAuthorController),
);
authorRoutes.put(
  "/:id",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  validateMiddleware(AuthorFormSchema, "body"),
  asyncHandler(putAuthorController),
);
export default authorRoutes;
