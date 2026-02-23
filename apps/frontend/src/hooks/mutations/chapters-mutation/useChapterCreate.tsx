import { createChapterMutate } from "@/api/chapters/postChapter";
import { CREATE } from "@/constants";
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

export const useChapterCreate = () => {
  const mutation = createChapterMutate();
  const baseHandlers = mutationConfig({
    action: CREATE,
    resource: "chapters",
    queryArg: {
      getListMutatekey: ({ id }: { id?: string }) =>
        getNovelChaptersQueryKey({
          id: id!,
          page: 1,
          sort: "desc",
          search: "",
        }),
      exact: true,
    },
    getMutateKey: getChapterQueryKey,
  });

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
            baseHandlers.onSuccess?.(data, data.novelId);
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
