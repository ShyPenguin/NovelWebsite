import { updateNovelService } from "../../services/novels/index.ts";
import { putControllerFactory } from "../factories/put-controller.ts";

export const putNovelController = putControllerFactory({
  service: updateNovelService,
});
