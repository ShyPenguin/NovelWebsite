import { putControllerFactory } from "@/shared/factories/controller/put.controller.ts";
import { updateAuthorService } from "../services/update-author.service.ts";

export const putAuthorController = putControllerFactory({
  service: updateAuthorService,
});
