import { updateAuthorService } from "@/services/authors/updateAuthorService.ts";
import { putControllerFactory } from "../factories/put-controller.ts";

export const putAuthorController = putControllerFactory({
  service: updateAuthorService,
});
