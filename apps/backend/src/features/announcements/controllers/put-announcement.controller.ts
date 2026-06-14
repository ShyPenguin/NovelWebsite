import { putControllerFactory } from "@/shared/factories/controller/put.controller.js";
import { updateAnnouncementService } from "../services/update-announcement.service.js";

export const putAnnouncementController = putControllerFactory({
  service: updateAnnouncementService,
});
