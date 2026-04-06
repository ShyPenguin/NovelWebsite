import { queryOptions } from "@tanstack/react-query";
import { type NovelLatestChapterDTO } from "@repo/contracts/dto/novel-latest-chapters";
import { ApiResponseSchema, GetNovelLatestChapters } from "@repo/contracts/api";
import { BackendApiLink } from "@/shared/constants";

const urlRoute = "chapters/allLatestChapters";

export type LatestChaptersResult = {
  free: NovelLatestChapterDTO[];
  paid: NovelLatestChapterDTO[];
};
export const fetchLatestChapters = async (): Promise<LatestChaptersResult> => {
  const response = await fetch(`${BackendApiLink}/${urlRoute}`, {
    credentials: "include",
  });
  const result = await response.json();
  const parsedResult = ApiResponseSchema(GetNovelLatestChapters).parse(result);

  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};

export const latestChaptersOptions = () =>
  queryOptions<LatestChaptersResult>({
    queryKey: ["latestChapters"],
    queryFn: () => fetchLatestChapters(),
    retry: import.meta.env.MODE == "dev",
  });
