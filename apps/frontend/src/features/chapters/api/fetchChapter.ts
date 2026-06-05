import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { queryOptions } from "@tanstack/react-query";
import { ApiResponseSchema } from "@repo/contracts/api";
import { ChapterDetailSchema } from "@repo/contracts/schemas/chapter";
import { BackendApiLink, INTERVAL_12_HRS } from "@/shared/constants";
import { notFound } from "@tanstack/react-router";
import { getChapterOneQueryKey } from "../utils/chapter.tanstack-keys";

export const fetchChapter = async ({
  novelId,
  chapterNumber,
}: {
  novelId: ChapterDetailDTO["novelId"];
  chapterNumber: ChapterDetailDTO["chapterNumber"];
}): Promise<ChapterDetailDTO> => {
  const response = await fetch(
    `${BackendApiLink}/novels/${novelId}/chapters/${chapterNumber}`,
    {
      credentials: "include",
    },
  );

  if (response.status === 404 || response.status === 400) {
    throw notFound();
  }

  const result = await response.json();

  const parsedData = ApiResponseSchema(ChapterDetailSchema).parse(result);

  if (!parsedData.ok) {
    throw new Error(parsedData.error.message);
  }

  return parsedData.data;
};

export const fetchChapterQueryOptions = ({
  novelId,
  chapterNumber,
}: {
  novelId: ChapterDetailDTO["novelId"];
  chapterNumber: ChapterDetailDTO["chapterNumber"];
}) =>
  queryOptions<ChapterDetailDTO>({
    queryKey: getChapterOneQueryKey({ novelId, chapterNumber }),
    queryFn: () => fetchChapter({ chapterNumber, novelId }),
    staleTime: INTERVAL_12_HRS,
    retry: import.meta.env.MODE == "dev",
  });
