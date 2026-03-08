import { asyncHandler } from "@/shared/utils/async-handler.ts";
import { Router } from "express";
import { getUserOneController } from "./controllers/get-user-one.controller.ts";
import { validateMiddleware } from "@/middlewares/validate-middleware.ts";
import { idSchema } from "@repo/contracts/schemas/id";
import { deleteUserController } from "./controllers/delete-user.controller.ts";
import { authMiddleware } from "@/middlewares/auth-middleware.ts";
import { UserRoleChangeSchema } from "@repo/contracts/schemas/user";
import { patchUserRoleController } from "./controllers/patch-user-role.controller.ts";

const userRoutes = Router();

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
export default userRoutes;
