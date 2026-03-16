import { asyncHandler } from "@/shared/utils/async-handler.js";
import { Router } from "express";
import { getUserOneController } from "./controllers/get-user-one.controller.js";
import { validateMiddleware } from "@/middlewares/validate-middleware.js";
import { idSchema } from "@repo/contracts/schemas/id";
import { deleteUserController } from "./controllers/delete-user.controller.js";
import { authMiddleware } from "@/middlewares/auth-middleware.js";
import {
  UserFormSchema,
  UserRoleChangeSchema,
} from "@repo/contracts/schemas/user";
import { patchUserRoleController } from "./controllers/patch-user-role.controller.js";
import { patchUserController } from "./controllers/patch-user.controller.js";
import { UserQuerySchema } from "./user.schema.js";
import { getUsersController } from "./controllers/get-users.controller.js";
import { upload } from "@/middlewares/upload.js";
import { patchUserImageController } from "./controllers/patch-user-image.controller.js";

const userRoutes = Router();

userRoutes.get(
  "/",
  validateMiddleware(UserQuerySchema, "query"),
  asyncHandler(getUsersController({ type: "thumbnail" })),
);

userRoutes.get("/:username", asyncHandler(getUserOneController));

userRoutes.delete(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(authMiddleware),
  asyncHandler(deleteUserController),
);
userRoutes.patch(
  "/:id/role",
  validateMiddleware(idSchema, "params"),
  asyncHandler(authMiddleware),
  validateMiddleware(UserRoleChangeSchema, "body"),
  asyncHandler(patchUserRoleController),
);

userRoutes.patch(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(authMiddleware),
  validateMiddleware(UserFormSchema, "body"),
  asyncHandler(patchUserController),
);

userRoutes.patch(
  "/:id/image",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  upload.single("image"),
  asyncHandler(patchUserImageController),
);

export default userRoutes;
