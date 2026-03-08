import { putControllerFactory } from "@/shared/factories/controller/put.controller.ts";
import { updateUserRoleService } from "../services/update-user-role.service.ts";

export const patchUserRoleController = putControllerFactory({
  service: updateUserRoleService,
});
