import type { VIEW, PREVIEW } from "@/shared/constants";
import { mutationConfig } from "@/shared/utils/mutation-configs";
import {
  getChapterOneQueryKey,
  getChaptersQueryKey,
} from "@/features/chapters/utils/chapters.tanstack-keys.";
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
