import { Router } from "express";
import { authorizeRole } from "../middlewares/authorizeRole.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { deleteAuthorController } from "../controllers/authorControllers/index.ts";
import { idSchema } from "../validations/fields.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getAuthorsController } from "@/controllers/authorControllers/get-authors-controller.ts";
import { getAuthorOneController } from "@/controllers/authorControllers/get-author-one-controller.ts";
import { postAuthorController } from "@/controllers/authorControllers/post-author-controller.ts";
import { AuthorQuerySchema } from "@/validations/AuthorValidator.ts";
import { AuthorFormSchema } from "@repo/contracts/schemas/author";
import { putAuthorController } from "@/controllers/authorControllers/put-author-controller.ts";

const authorRoutes = Router();

authorRoutes.get(
  "/",
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
  validateMiddleware(idSchema, "params"),
  asyncHandler(authMiddleware),
  authorizeRole(["admin"], "delete", "authors"),
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
