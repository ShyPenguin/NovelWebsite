import { asyncHandler } from "@/shared/utils/async-handler.ts";
import { Router } from "express";
import { getUserOneController } from "./controllers/get-user-one.controller.ts";
import { validateMiddleware } from "@/middlewares/validate-middleware.ts";
import { idSchema } from "@repo/contracts/schemas/id";
import { deleteUserController } from "./controllers/delete-user.controller.ts";
import { authMiddleware } from "@/middlewares/auth-middleware.ts";
import {
  UserFormSchema,
  UserRoleChangeSchema,
} from "@repo/contracts/schemas/user";
import { patchUserRoleController } from "./controllers/patch-user-role.controller.ts";
import { patchUserController } from "./controllers/patch-user.controller.ts";
import { UserQuerySchema } from "./user.schema.ts";
import { getUsersController } from "./controllers/get-users.controller.ts";
import { upload } from "@/middlewares/upload.ts";
import { patchUserImageController } from "./controllers/patch-user-image.controller.ts";

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
