import type { VIEW, PREVIEW } from "@/shared/constants";
import { mutationConfig } from "@/shared/utils/mutation-configs";
import { getUserOneQueryKey, getUsersQueryKey } from "./user.tanstack-keys";
import type { Action } from "@repo/contracts/auth/permissions/resource";

export const userMutationConfig = (
  action: Exclude<Action<"users">, typeof VIEW | typeof PREVIEW>,
) => {
  return mutationConfig({
    action,
    resource: "users",
    queryArg: {
      getListQueryKey: () => getUsersQueryKey,
      exact: false,
    },
    getQueryKey: getUserOneQueryKey,
  });
};
