import { postControllerFactory } from "@/shared/factories/controller/post.controller.js";
import { createAuthorService } from "../services/create-author.service.js";

export const postAuthorController = postControllerFactory({
  service: createAuthorService,
});
