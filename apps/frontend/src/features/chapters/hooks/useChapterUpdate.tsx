import { updateChapterMutate } from "@/features/chapters/api/putChapter";
import { chapterMutationConfig } from "@/features/chapters/utils/chapter.mutation-config";
import type {
  ChapterFormParsedDTO,
  ChapterDetailDTO,
} from "@repo/contracts/dto/chapter";
import type { MutateOptions } from "@tanstack/react-query";

export const useChapterUpdate = (chapter: ChapterDetailDTO) => {
  const mutation = updateChapterMutate(chapter.id);
  const baseHandlers = chapterMutationConfig("update");

  return {
    mutate: ({
      formData,
      options,
    }: {
      formData: ChapterFormParsedDTO;
      options?: MutateOptions<
        ChapterDetailDTO,
        unknown,
        { formData: ChapterFormParsedDTO }
      >;
    }) =>
      mutation.mutate(
        {
          formData,
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
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
};
