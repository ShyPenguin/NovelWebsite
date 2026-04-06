import type { UserDetailDTO } from "@repo/contracts/dto/user";
import { queryOptions } from "@tanstack/react-query";
import { ApiResponseSchema } from "@repo/contracts/api";
import { UserDetailSchema } from "@repo/contracts/schemas/user";
import { INTERVAL_12_HRS } from "@/shared/constants";
import { notFound } from "@tanstack/react-router";
import { getUserOneQueryKey } from "../utils/user.tanstack-keys";
import { userUrl } from "../user.constant";

export const fetchUser = async ({
  username,
}: {
  username: UserDetailDTO["username"];
}): Promise<UserDetailDTO> => {
  const response = await fetch(`${userUrl}/${username}`, {
    credentials: "include",
  });

  if (response.status === 404 || response.status === 400) {
    throw notFound();
  }

  const result = await response.json();

  const parsedData = ApiResponseSchema(UserDetailSchema).parse(result);

  if (!parsedData.ok) {
    throw new Error(parsedData.error.message);
  }

  return parsedData.data;
};

export const fetchUserQueryOptions = (username: UserDetailDTO["username"]) =>
  queryOptions<UserDetailDTO>({
    queryKey: getUserOneQueryKey(username),
    queryFn: () => fetchUser({ username }),
    staleTime: INTERVAL_12_HRS,
    retry: import.meta.env.MODE == "dev",
  });
