import { updateChapterMutate } from "@/api/chapters/putChapter";
import { UPDATE } from "@/constants";
import { mutationConfig } from "@/utils/mutation-configs";
import {
  getNovelChaptersQueryKey,
  getChapterQueryKey,
} from "@/utils/tanstack-keys/novelChapters";
import type {
  ChapterFormParsedDTO,
  ChapterDetailDTO,
} from "@repo/contracts/dto/chapter";
import type { MutateOptions } from "@tanstack/react-query";

export const useChapterUpdate = (chapter: ChapterDetailDTO) => {
  const mutation = updateChapterMutate(chapter.id);
  const baseHandlers = mutationConfig({
    action: UPDATE,
    resource: "chapters",
    queryArg: {
      getListMutatekey: ({ id }: { id?: string }) =>
        getNovelChaptersQueryKey({
          id: id || "",
          page: 1,
          sort: "desc",
          search: "",
        }),
      exact: true,
    },
    getMutateKey: getChapterQueryKey,
  });

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
            baseHandlers.onSuccess?.(data, data.novelId);
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
