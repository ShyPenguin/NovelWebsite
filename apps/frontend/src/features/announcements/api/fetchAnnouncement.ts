import type { AnnouncementDetailDTO } from "@repo/contracts/dto/announcement";
import { getAnnouncementOneQueryKey } from "../utils/announcement.tanstack-keys";
import { ApiResponseSchema } from "@repo/contracts/api";
import { queryOptions } from "@tanstack/react-query";
import { urlApiRoute } from "../announcement.constant";
import { INTERVAL_24_HRS } from "@/shared/constants";
import { AnnouncementDetailSchema } from "@repo/contracts/schemas/announcement";
import { notFound } from "@tanstack/react-router";

export const fetchAnnouncement = async ({
  id,
}: {
  id: string;
}): Promise<AnnouncementDetailDTO> => {
  const response = await fetch(`${urlApiRoute}/${id}`, {
    credentials: "include",
  });

  if (response.status === 404 || response.status === 400) {
    throw notFound();
  }

  const result = await response.json();

  const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
    result,
  );
  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};

export const announcementQueryOptions = (id: AnnouncementDetailDTO["id"]) =>
  queryOptions<AnnouncementDetailDTO>({
    queryKey: getAnnouncementOneQueryKey({ id }),
    queryFn: () => fetchAnnouncement({ id: id }),
    staleTime: INTERVAL_24_HRS,
    retry: false,
  });
