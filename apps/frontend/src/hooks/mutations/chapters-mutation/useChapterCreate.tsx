import { createChapterMutate } from "@/api/chapters/postChapter";
import { chapterMutationConfig } from "@/features/chapters/utils/chapter.mutation-config";
import type {
  ChapterFormParsedDTO,
  ChapterDetailDTO,
} from "@repo/contracts/dto/chapter";
import type { MutateOptions } from "@tanstack/react-query";

export const useChapterCreate = () => {
  const mutation = createChapterMutate();
  const baseHandlers = chapterMutationConfig("create");

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      formData,
      novelId,
      options,
    }: {
      formData: ChapterFormParsedDTO;
      novelId: ChapterDetailDTO["novelId"];
      options?: MutateOptions<
        ChapterDetailDTO,
        unknown,
        { formData: ChapterFormParsedDTO }
      >;
    }) =>
      mutation.mutate(
        {
          formData,
          novelId: novelId,
        },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.({
              data,
              id: data.id,
              parentId: data.novelId,
            });
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
