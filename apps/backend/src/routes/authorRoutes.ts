import { Router } from "express";
import { getAuthorsController } from "@/controllers/authorControllers/get-authors-controller.ts";
import { getAuthorOneController } from "@/controllers/authorControllers/get-author-one-controller.ts";
import { postAuthorController } from "@/controllers/authorControllers/post-author-controller.ts";
import { AuthorQuerySchema } from "@/validations/AuthorValidator.ts";
import { AuthorFormSchema } from "@repo/contracts/schemas/author";
import { putAuthorController } from "@/controllers/authorControllers/put-author-controller.ts";
import { deleteAuthorController } from "@/controllers/authorControllers/delete-author-controller.ts";
import { authMiddleware } from "@/middlewares/authMiddleware.ts";
import { asyncHandler } from "@/utils/asyncHandler.ts";
import { validateMiddleware } from "@/middlewares/validateMiddleware.ts";
import { idSchema } from "@/validations/fields.ts";

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
