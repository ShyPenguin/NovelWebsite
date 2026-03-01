import { deleteChapterMutate } from "@/features/chapters/api/deleteChapter";
import { chapterMutationConfig } from "@/features/chapters/utils/chapter.mutation-config";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import type { MutateOptions } from "@tanstack/react-query";

export const useChapterDelete = ({
  id,
  novelId,
}: {
  id: ChapterDetailDTO["id"];
  novelId: ChapterDetailDTO["novelId"];
}) => {
  const mutation = deleteChapterMutate(id);
  const baseHandlers = chapterMutationConfig("delete");

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      options,
    }: {
      options?: MutateOptions<
        { id: ChapterDetailDTO["id"] },
        unknown,
        { chapterId: ChapterDetailDTO["id"] }
      >;
    }) =>
      mutation.mutate(
        {
          chapterId: id,
        },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.({ data, id: data.id, parentId: novelId });
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
