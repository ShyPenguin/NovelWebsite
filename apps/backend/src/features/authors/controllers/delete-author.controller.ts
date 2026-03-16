import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.js";
import { deleteAuthorService } from "../services/delete-author.service.js";

export const deleteAuthorController = deleteControllerFactory({
  service: deleteAuthorService,
});
