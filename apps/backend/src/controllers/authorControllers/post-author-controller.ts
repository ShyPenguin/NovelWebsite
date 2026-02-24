import { createAuthorService } from "@/services/authors/createAuthorService.ts";
import { postControllerFactory } from "../factories/post-controller.ts";

export const postAuthorController = postControllerFactory({
  service: createAuthorService,
});
