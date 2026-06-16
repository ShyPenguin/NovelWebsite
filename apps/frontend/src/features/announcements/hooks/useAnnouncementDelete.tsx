import { announcementMutationConfig } from "@/features/announcements/utils/announcement.mutation-config";
import type { AnnouncementDetailDTO } from "@repo/contracts/dto/announcement";
import type { MutateOptions } from "@tanstack/react-query";
import { deleteAnnouncementMutate } from "../api/deleteAnnouncement";

export const useAnnouncementDelete = () => {
  const mutation = deleteAnnouncementMutate();
  const baseHandlers = announcementMutationConfig("delete");

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      id,
      options,
    }: {
      id: AnnouncementDetailDTO["id"];
      options?: MutateOptions<
        { id: AnnouncementDetailDTO["id"] },
        unknown,
        AnnouncementDetailDTO["id"]
      >;
    }) =>
      mutation.mutate(id, {
        ...baseHandlers,
        ...options,
        onSuccess: (data, vars, onResult, ctx) => {
          baseHandlers.onSuccess?.({ data }, { id: data.id });
          options?.onSuccess?.(data, vars, onResult, ctx);
        },
        onError(error, vars, onResult, ctx) {
          baseHandlers.onError(error);
          options?.onError?.(error, vars, onResult, ctx);
        },
      }),

    ...rest,
  };
};
