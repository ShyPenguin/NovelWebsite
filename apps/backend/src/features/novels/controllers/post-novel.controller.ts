import { postControllerFactory } from "@/shared/factories/controller/post.controller.js";
import { createNovelService } from "../services/create-novel.service.js";

export const postNovelController = postControllerFactory({
  service: createNovelService,
});
