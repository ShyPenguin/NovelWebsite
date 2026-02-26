import { deleteControllerFactory } from "../factories/delete-controller.ts";
import { deleteAuthorService } from "@/services/authors/deleteAuthorService.ts";

export const deleteAuthorController = deleteControllerFactory({
  service: deleteAuthorService,
});
