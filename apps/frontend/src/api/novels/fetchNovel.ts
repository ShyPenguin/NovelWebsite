import { INTERVAL_24_HRS } from "../../constants";
import { queryOptions } from "@tanstack/react-query";
import { novelUrl } from "./url";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { getNovelOneQueryKey } from "@/utils/tanstack-keys/novels";
import { ApiResponseSchema } from "@repo/contracts/api";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";

export const fetchNovel = async ({
  id,
}: {
  id: string;
}): Promise<NovelDetailDTO> => {
  const response = await fetch(`${novelUrl}/${id}`, {
    method: "GET",
  });

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
    staleTime: INTERVAL_24_HRS,
  });
