import type { VIEW, PREVIEW } from "@/shared/constants";
import { mutationConfig } from "@/shared/utils/mutation-configs";
import {
  getAnnouncementOneQueryKey,
  getAnnouncementsQueryKey,
} from "./announcement.tanstack-keys";
import type { Action } from "@repo/contracts/auth/permissions/resource";

export const announcementMutationConfig = (
  action: Exclude<Action<"announcements">, typeof VIEW | typeof PREVIEW>,
) => {
  return mutationConfig({
    action,
    resource: "announcements",
    queryArg: {
      getListQueryKey: () => getAnnouncementsQueryKey,
      exact: false,
    },
    getQueryKey: getAnnouncementOneQueryKey,
  });
};
