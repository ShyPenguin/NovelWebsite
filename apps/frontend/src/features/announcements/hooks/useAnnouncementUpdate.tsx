import type { MutateOptions } from "@tanstack/react-query";
import type {
  AnnouncementFormDTO,
  AnnouncementDetailDTO,
} from "@repo/contracts/dto/announcement";
import { announcementMutationConfig } from "../utils/announcement.mutation-config";
import { updateAnnouncementMutate } from "../api/putAnnouncement";

export const useAnnouncementUpdate = (announcement: AnnouncementDetailDTO) => {
  const mutation = updateAnnouncementMutate(announcement.id);
  const baseHandlers = announcementMutationConfig("update");

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
            baseHandlers.onSuccess?.(
              {
                data,
              },
              { id: data.id },
            );
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
