import { postControllerFactory } from "@/shared/factories/controller/post.controller.ts";
import { createNovelService } from "../services/create-novel.service.ts";

export const postNovelController = postControllerFactory({
  service: createNovelService,
});
