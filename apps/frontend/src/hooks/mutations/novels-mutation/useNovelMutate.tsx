import type { NovelDetailDTO, NovelFormDTO } from "@repo/contracts/dto/novel";
import type { MutateOptions } from "@tanstack/react-query";
import { CREATE, UPDATE } from "@/constants";
import { createNovelMutate } from "@/api/novels/postNovel";
import { updateNovelMutate } from "@/api/novels/putNovel";
import { novelMutationConfig } from "@/features/novels/utils/novel.mutation-config";

export const useNovelMutate = (novel: NovelDetailDTO | null) => {
  const mutation = novel ? updateNovelMutate(novel.id) : createNovelMutate();
  const { mutate: _removed, ...rest } = mutation;
  const mode = novel ? UPDATE : CREATE;
  const baseHandlers = novelMutationConfig(mode);

  return {
    mutate: ({
      formData,
      options,
    }: {
      formData: NovelFormDTO;
      options?: MutateOptions<
        NovelDetailDTO,
        unknown,
        { formData: NovelFormDTO }
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
