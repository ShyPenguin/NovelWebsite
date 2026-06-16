import type { MutateOptions } from "@tanstack/react-query";
import { createAnnouncementMutate } from "../api/postAnnouncement";
import type {
  AnnouncementFormDTO,
  AnnouncementDetailDTO,
} from "@repo/contracts/dto/announcement";
import { announcementMutationConfig } from "../utils/announcement.mutation-config";

export const useAnnouncementCreate = () => {
  const mutation = createAnnouncementMutate();
  const baseHandlers = announcementMutationConfig("create");

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      formData,
      options,
    }: {
      formData: AnnouncementFormDTO;
      options?: MutateOptions<
        AnnouncementDetailDTO,
        unknown,
        AnnouncementFormDTO
      >;
    }) =>
      mutation.mutate(
        {
          ...formData,
        },
        {
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
        },
      ),
    ...rest,
  };
};
