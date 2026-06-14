import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.js";
import { deleteAnnouncementService } from "../services/delete-announcement.service.js";

export const deleteAnnouncementController = deleteControllerFactory({
  service: deleteAnnouncementService,
});
