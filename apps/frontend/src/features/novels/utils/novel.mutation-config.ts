import type { VIEW, PREVIEW } from "@/shared/constants";
import { mutationConfig } from "@/shared/utils/mutation-configs";
import {
  getNovelOneQueryKey,
  getNovelsQueryKey,
} from "@/features/novels/utils/novels.tanstack-keys";
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
