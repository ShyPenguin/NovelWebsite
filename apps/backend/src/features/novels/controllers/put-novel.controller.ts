import { putControllerFactory } from "@/shared/factories/controller/put.controller.ts";
import { updateNovelService } from "../services/update-novel.service.ts";

export const putNovelController = putControllerFactory({
  service: updateNovelService,
});
