import type { VIEW, PREVIEW } from "@/constants";
import { mutationConfig } from "@/utils/mutation-configs";
import {
  getAuthorOneQueryKey,
  getAuthorsQueryKey,
} from "./authors.tanstack-keys";
import type { Action } from "@repo/contracts/auth/permissions";

export const authorMutationConfig = (
  action: Exclude<Action, typeof VIEW | typeof PREVIEW>,
) => {
  return mutationConfig({
    action,
    resource: "authors",
    queryArg: {
      getListQueryKey: () => getAuthorsQueryKey,
      exact: false,
    },
    getQueryKey: getAuthorOneQueryKey,
  });
};
