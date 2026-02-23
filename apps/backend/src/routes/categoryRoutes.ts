import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { authorizeRole } from "../middlewares/authorizeRole.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import {
  CategoryFormSchema,
  CategoryQuerySchema,
} from "../validations/CategoryValidator.ts";
import {
  getCategoriesController,
  postCategoryController,
  getCategoryOneController,
  deleteCategoryController,
  putCategoryController,
} from "../controllers/categoryControllers/index.ts";
import { idSchema } from "../validations/fields.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const categoryRoutes = Router();

categoryRoutes.get(
  "/",
  validateMiddleware(CategoryQuerySchema, "query"),
  asyncHandler(getCategoriesController),
);
categoryRoutes.post(
  "/",
  validateMiddleware(CategoryFormSchema, "body"),
  authMiddleware,
  authorizeRole(["admin"], "create", "category"),
  asyncHandler(postCategoryController),
);
categoryRoutes.get(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(getCategoryOneController),
);
categoryRoutes.delete(
  "/:id",
  validateMiddleware(idSchema, "params"),
  authMiddleware,
  authorizeRole(["admin"], "delete", "category"),
  asyncHandler(deleteCategoryController),
);
categoryRoutes.put(
  "/:id",
  validateMiddleware(idSchema, "params"),
  validateMiddleware(CategoryFormSchema, "body"),
  authMiddleware,
  authorizeRole(["admin"], "update", "category"),
  asyncHandler(putCategoryController),
);
export default categoryRoutes;
