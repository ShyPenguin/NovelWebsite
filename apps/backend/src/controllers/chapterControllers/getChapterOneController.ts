import { getChapterOneService } from "../../services/chapters/index.ts";
import { getOneControllerFactory } from "../factories/get-one-controller.ts";

export const getChapterOneController = getOneControllerFactory({
  service: getChapterOneService,
});
