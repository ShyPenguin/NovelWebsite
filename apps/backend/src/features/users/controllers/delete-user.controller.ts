import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.ts";
import { deleteUserService } from "../services/delete-user.service.ts";

export const deleteUserController = deleteControllerFactory({
  service: deleteUserService,
});
