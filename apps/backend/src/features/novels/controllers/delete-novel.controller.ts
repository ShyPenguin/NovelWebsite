import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.ts";
import { deleteNovelWithAssetsService } from "../services/delete-novel-with-assets.service.ts";

export const deleteNovelController = deleteControllerFactory({
  service: deleteNovelWithAssetsService,
});
