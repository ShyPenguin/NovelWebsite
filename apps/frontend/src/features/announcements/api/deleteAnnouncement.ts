import { deleteResourceFactory } from "@/shared/api/delete";
import type { AnnouncementDetailDTO } from "@repo/contracts/dto/announcement";
import { useMutation } from "@tanstack/react-query";

export const deleteAnnouncement = deleteResourceFactory({
  resource: "announcements",
});

export const deleteAnnouncementMutate = () => {
  return useMutation({
    mutationKey: ["announcement", "delete"],
    mutationFn: (id: AnnouncementDetailDTO["id"]) => deleteAnnouncement({ id }),
  });
};
