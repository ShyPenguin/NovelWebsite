import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.js";
import { deleteAnnouncementTx } from "../repositories/delete.repository.js";
import { getAnnouncementAuthByIdTx } from "../repositories/get-announcement-one.repository.js";

export const deleteAnnouncementService = deleteResourceServiceFactory({
  resource: "announcements",
  getResourceRepo: getAnnouncementAuthByIdTx,
  deleteResourceRepo: ({ tx, resource }) => {
    return deleteAnnouncementTx({ tx, id: resource.id });
  },
});
