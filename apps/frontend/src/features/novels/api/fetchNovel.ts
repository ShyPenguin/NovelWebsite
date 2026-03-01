import { queryOptions } from "@tanstack/react-query";
import { novelUrl } from "./url";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { getNovelOneQueryKey } from "@/features/novels/utils/novels.tanstack-keys";
import { ApiResponseSchema } from "@repo/contracts/api";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";
import { notFound } from "@tanstack/react-router";

export const fetchNovel = async ({
  id,
}: {
  id: string;
}): Promise<NovelDetailDTO> => {
  const response = await fetch(`${novelUrl}/${id}`);

  if (response.status === 404 || response.status === 400) {
    throw notFound();
  }
  const result = await response.json();

  const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(result);

  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};

export const novelQueryOptions = (id: NovelDetailDTO["id"]) =>
  queryOptions<NovelDetailDTO>({
    queryKey: getNovelOneQueryKey({ id }),
    queryFn: () => fetchNovel({ id: id }),
  });
