import { useMutation } from "@tanstack/react-query";
import { getAnnouncementCreateKey } from "../utils/announcement.tanstack-keys";
import { urlApiRoute } from "../announcement.constant";
import type {
  AnnouncementFormDTO,
  AnnouncementDetailDTO,
} from "@repo/contracts/dto/announcement";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AnnouncementDetailSchema } from "@repo/contracts/schemas/announcement";

export const postAnnouncement = async (
  formData: AnnouncementFormDTO,
): Promise<AnnouncementDetailDTO> => {
  const response = await fetch(`${urlApiRoute}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

export const createAnnouncementMutate = () => {
  return useMutation({
    mutationKey: getAnnouncementCreateKey,
    mutationFn: postAnnouncement,
  });
};
