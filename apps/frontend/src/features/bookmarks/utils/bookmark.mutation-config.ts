import { getNovelOneQueryKey } from "@/features/novels/utils/novels.tanstack-keys";
import type { VIEW, PREVIEW } from "@/shared/constants";
import { mutationConfig } from "@/shared/utils/mutation-configs";
import type { Action } from "@repo/contracts/auth/permissions/resource";
import { getBookmarksQueryKey } from "./bookmark.tanstack-keys";

export const bookmarkMutationConfig = (
  action: Exclude<Action<"bookmarks">, typeof VIEW | typeof PREVIEW>,
) => {
  return mutationConfig({
    action,
    resource: "bookmarks",
    queryArg: {
      getListQueryKey: () => getBookmarksQueryKey,
      exact: false,
    },
    getQueryKey: getNovelOneQueryKey,
  });
};
