import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.ts";
import { deleteAuthorService } from "../services/delete-author.service.ts";

export const deleteAuthorController = deleteControllerFactory({
  service: deleteAuthorService,
});
