import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import type { MutateOptions } from "@tanstack/react-query";
import { mutationConfig } from "@/utils/mutation-configs";
import {
  getNovelOneQueryKey,
  getNovelsQueryKey,
} from "@/utils/tanstack-keys/novels";
import { updateNovelCoverMutate } from "@/api/novels/patchNovelCover";
import type z from "zod";
import type { NovelCoverImageFormSchema } from "@/schemas/novels";

export const useNovelCoverMutate = ({
  novelId,
}: {
  novelId: NovelDetailDTO["id"];
}) => {
  const mutation = updateNovelCoverMutate(novelId);
  const { mutate: _removed, ...rest } = mutation;
  const baseHandlers = mutationConfig({
    action: "UPDATE",
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
