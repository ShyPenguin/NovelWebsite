import { putControllerFactory } from "@/shared/factories/controller/put.controller.js";
import { updateNovelService } from "../services/update-novel.service.js";

export const putNovelController = putControllerFactory({
  service: updateNovelService,
});
