import { putControllerFactory } from "@/shared/factories/controller/put.controller.ts";
import { updateUserService } from "../services/update-user.service.ts";

export const patchUserController = putControllerFactory({
  service: updateUserService,
});
