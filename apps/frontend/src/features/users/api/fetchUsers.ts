import type { Paginated, FetchType } from "@/shared/types";
import type { FullResponseMap } from "@/shared/types/responseTypes";
import { ApiResponseSchema } from "@repo/contracts/api";
import type { ZodType } from "zod";
import type { UserSearchPaginated, UserSearchType } from "../user.schema";
import type { UserResponseMap, FetchUsersReturn } from "../user.type";
import { PaginatedUserThumbnailSchema } from "@repo/contracts/schemas/user";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { UserThumbnailDTO } from "@repo/contracts/dto/user";
import { INTERVAL_24_HRS } from "@/shared/constants";
import { userUrl } from "../user.constant";

export const fetchUsers = <
  T extends keyof FullResponseMap<UserResponseMap>,
  P extends boolean,
>({
  type,
  paginated,
  schema,
}: {
  type: T;
  paginated: P;
  schema: ZodType<FetchUsersReturn<T>>;
}) => {
  void type;

  return async function (
    params: FetchType<P extends true ? UserSearchPaginated : UserSearchType>,
  ): Promise<FetchUsersReturn<T>> {
    let url = `${userUrl}`;

    if (params.withQuery) {
      const { search, sort, role } = params.data;

      url += `?sort=${sort}`;

      if (search) {
        url += `&search=${search}`;
      }

      if (role !== "all") {
        url += `&role=${role}`;
      }
      if ("page" in params.data && paginated) {
        url += `&page=${params.data.page}`;
      }
    }

    const response = await fetch(url);

    const result = await response.json();

    const parsedResult = ApiResponseSchema(schema).parse(result);

    if (!parsedResult.ok) {
      throw new Error(parsedResult.error.message);
    }

    return parsedResult.data;
  };
};

// Might be used in the future
// const fetchUserArray = fetchUsers({
//   type: "thumbnail",
//   paginated: false,
//   schema: ArrayUserThumbnailSchema,
// });

const fetchUserPaginated = fetchUsers({
  type: "paginated.thumbnail",
  paginated: true,
  schema: PaginatedUserThumbnailSchema,
});

export const usersPaginatedQueryOption = ({
  page,
  sort,
  search,
  role,
}: UserSearchPaginated) =>
  queryOptions<Paginated<UserThumbnailDTO[]>>({
    queryKey: ["users", { page, sort, search, role }],
    queryFn: () =>
      fetchUserPaginated({
        withQuery: true,
        data: { page, sort, search, role },
      }),
    staleTime: INTERVAL_24_HRS,
    placeholderData: keepPreviousData,
  });
