import type { AuthorDetailDTO } from "@repo/contracts/dto/author";
import { getAuthorOneQueryKey } from "../utils/authors.tanstack-keys";
import { ApiResponseSchema } from "@repo/contracts/api";
import { queryOptions } from "@tanstack/react-query";
import { urlApiRoute } from "../author.constant";
import { INTERVAL_24_HRS } from "@/shared/constants";
import { AuthorDetailSchema } from "@repo/contracts/schemas/author";
import { notFound } from "@tanstack/react-router";

export const fetchAuthor = async ({
  id,
}: {
  id: string;
}): Promise<AuthorDetailDTO> => {
  const response = await fetch(`${urlApiRoute}/${id}`, {
    credentials: "include",
  });

  if (response.status === 404 || response.status === 400) {
    throw notFound();
  }

  const result = await response.json();

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
    retry: false,
  });
