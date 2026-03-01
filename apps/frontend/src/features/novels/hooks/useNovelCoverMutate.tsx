import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import type { MutateOptions } from "@tanstack/react-query";
import { mutationConfig } from "@/shared/utils/mutation-configs";
import {
  getNovelOneQueryKey,
  getNovelsQueryKey,
} from "@/features/novels/utils/novels.tanstack-keys";
import { updateNovelCoverMutate } from "@/features/novels/api/patchNovelCover";
import type z from "zod";
import type { NovelCoverImageFormSchema } from "@/features/novels/novel.schema";

export const useNovelCoverMutate = ({
  novelId,
}: {
  novelId: NovelDetailDTO["id"];
}) => {
  const mutation = updateNovelCoverMutate(novelId);
  const { mutate: _removed, ...rest } = mutation;
  const baseHandlers = mutationConfig({
    action: "update",
    resource: "novels",
    queryArg: {
      getListQueryKey: () => getNovelsQueryKey,
      exact: false,
    },
    getQueryKey: getNovelOneQueryKey,
  });
  return {
    mutate: ({
      formData,
      options,
    }: {
      formData: z.infer<typeof NovelCoverImageFormSchema>;
      options?: MutateOptions<
        NovelDetailDTO,
        unknown,
        { formData: z.infer<typeof NovelCoverImageFormSchema> }
      >;
    }) =>
      mutation.mutate(
        { formData },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.({ data, id: data.id });
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
