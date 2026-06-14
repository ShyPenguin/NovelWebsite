import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.js";
import { getAnnouncementDetailByIdTx } from "../repositories/get-announcement-one.repository.js";

export const getAnnouncementOneService = getResourceServiceFactory({
  resource: "announcements",
  repository: getAnnouncementDetailByIdTx,
});
