import type { VIEW, PREVIEW } from "@/constants";
import { mutationConfig } from "@/utils/mutation-configs";
import {
  getNovelOneQueryKey,
  getNovelsQueryKey,
} from "@/utils/tanstack-keys/novels";
import type { Action } from "@repo/contracts/auth/permissions";

export const novelMutationConfig = (
  action: Exclude<Action, typeof VIEW | typeof PREVIEW>,
) => {
  return mutationConfig({
    action,
    resource: "novels",
    queryArg: {
      getListQueryKey: () => getNovelsQueryKey,
      exact: false,
    },
    getQueryKey: getNovelOneQueryKey,
  });
};
