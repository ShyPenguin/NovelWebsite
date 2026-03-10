import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { queryOptions } from "@tanstack/react-query";
import { ApiResponseSchema } from "@repo/contracts/api";
import { ChapterDetailSchema } from "@repo/contracts/schemas/chapter";
import { BackendApiLink, INTERVAL_12_HRS } from "@/shared/constants";
import { notFound } from "@tanstack/react-router";
import { getChapterOneQueryKey } from "../utils/chapter.tanstack-keys";

const urlRoute = "chapters";
export const fetchChapter = async ({
  chapterId,
}: {
  chapterId: ChapterDetailDTO["id"];
}): Promise<ChapterDetailDTO> => {
  const response = await fetch(`${BackendApiLink}/${urlRoute}/${chapterId}`);

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
  chapterId,
}: {
  chapterId: ChapterDetailDTO["id"];
}) =>
  queryOptions<ChapterDetailDTO>({
    queryKey: getChapterOneQueryKey({ id: chapterId }),
    queryFn: () => fetchChapter({ chapterId }),
    staleTime: INTERVAL_12_HRS,
  });
