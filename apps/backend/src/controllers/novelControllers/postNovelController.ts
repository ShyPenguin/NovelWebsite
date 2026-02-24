import { createNovelService } from "../../services/novels/createNovelService.ts";
import { postControllerFactory } from "../factories/post-controller.ts";

export const postNovelController = postControllerFactory({
  service: createNovelService,
});
