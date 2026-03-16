import { putControllerFactory } from "@/shared/factories/controller/put.controller.js";
import { updateAuthorService } from "../services/update-author.service.js";

export const putAuthorController = putControllerFactory({
  service: updateAuthorService,
});
