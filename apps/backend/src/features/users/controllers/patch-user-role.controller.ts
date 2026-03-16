import { putControllerFactory } from "@/shared/factories/controller/put.controller.js";
import { updateUserRoleService } from "../services/update-user-role.service.js";

export const patchUserRoleController = putControllerFactory({
  service: updateUserRoleService,
});
