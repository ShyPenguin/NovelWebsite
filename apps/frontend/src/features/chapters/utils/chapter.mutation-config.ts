import type { VIEW, PREVIEW } from "@/constants";
import { mutationConfig } from "@/utils/mutation-configs";
import {
  getChapterOneQueryKey,
  getChaptersQueryKey,
} from "@/utils/tanstack-keys/novelChapters";
import type { Action } from "@repo/contracts/auth/permissions";

export const chapterMutationConfig = (
  action: Exclude<Action, typeof VIEW | typeof PREVIEW>,
) => {
  return mutationConfig({
    action,
    resource: "chapters",
    queryArg: {
      getListQueryKey: () => getChaptersQueryKey,
      exact: false,
    },
    getQueryKey: getChapterOneQueryKey,
  });
};
