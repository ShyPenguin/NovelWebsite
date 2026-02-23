import { deleteNovelWithAssetsService } from "@/services/novels/delete-novel-with-assets-service.ts";
import { deleteControllerFactory } from "../factories/delete-controller.ts";

export const deleteNovelController = deleteControllerFactory({
  service: deleteNovelWithAssetsService,
});
