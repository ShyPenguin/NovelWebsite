import { postControllerFactory } from "@/shared/factories/controller/post.controller.ts";
import { createAuthorService } from "../services/create-author.service.ts";

export const postAuthorController = postControllerFactory({
  service: createAuthorService,
});
