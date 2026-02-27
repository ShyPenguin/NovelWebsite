import type { AuthorDetailDTO } from "@repo/contracts/dto/author";
import { getAuthorOneQueryKey } from "../authors.tanstack-keys";
import { ApiResponseSchema } from "@repo/contracts/api";
import { queryOptions } from "@tanstack/react-query";
import { urlApiRoute } from "../constant";
import { INTERVAL_24_HRS } from "@/constants";
import { AuthorDetailSchema } from "@repo/contracts/schemas/author";

export const fetchAuthor = async ({
  id,
}: {
  id: string;
}): Promise<AuthorDetailDTO> => {
  const response = await fetch(`${urlApiRoute}/${id}`, {
    method: "GET",
  });

  const result = await response.json();

  console.log(result);
  const parsedResult = ApiResponseSchema(AuthorDetailSchema).parse(result);
  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};

export const authorQueryOptions = (id: AuthorDetailDTO["id"]) =>
  queryOptions<AuthorDetailDTO>({
    queryKey: getAuthorOneQueryKey({ id }),
    queryFn: () => fetchAuthor({ id: id }),
    staleTime: INTERVAL_24_HRS,
  });
