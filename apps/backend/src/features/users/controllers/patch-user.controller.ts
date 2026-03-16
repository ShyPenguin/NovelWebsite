import { putControllerFactory } from "@/shared/factories/controller/put.controller.js";
import { updateUserService } from "../services/update-user.service.js";

export const patchUserController = putControllerFactory({
  service: updateUserService,
});
