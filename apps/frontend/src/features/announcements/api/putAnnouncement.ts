import type {
  AnnouncementDetailDTO,
  AnnouncementFormDTO,
} from "@repo/contracts/dto/announcement";
import { urlApiRoute } from "../announcement.constant";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AnnouncementDetailSchema } from "@repo/contracts/schemas/announcement";
import { getAnnouncementUpdateKey } from "../utils/announcement.tanstack-keys";
import { useMutation } from "@tanstack/react-query";

type AnnouncementUpdateForm = {
  formData: AnnouncementFormDTO;
  id: AnnouncementDetailDTO["id"];
};
export const putAnnouncement = async ({
  formData,
  id,
}: AnnouncementUpdateForm): Promise<AnnouncementDetailDTO> => {
  const response = await fetch(`${urlApiRoute}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Important for sending JSON data
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const result = await response.json();

  const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
    result,
  );
  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }
  return parsedResult.data;
};

export const updateAnnouncementMutate = (id: AnnouncementDetailDTO["id"]) => {
  return useMutation({
    mutationKey: getAnnouncementUpdateKey({ id }),
    mutationFn: (formData: AnnouncementFormDTO) =>
      putAnnouncement({ formData, id }),
  });
};
