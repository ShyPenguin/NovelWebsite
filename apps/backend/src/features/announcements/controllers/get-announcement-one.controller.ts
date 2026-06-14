import { AnnouncementDetailEncodeDTO } from "@repo/contracts/dto/announcement";
import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.js";
import { getAnnouncementOneService } from "../services/get-announcement-one.service.js";

export const getAnnouncementOneController = getOneControllerFactory<
  { id: string },
  AnnouncementDetailEncodeDTO
>({
  service: getAnnouncementOneService,
});
