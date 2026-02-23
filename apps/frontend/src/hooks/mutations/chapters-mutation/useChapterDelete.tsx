import { deleteChapterMutate } from "@/api/chapters/deleteChapter";
import { DELETE } from "@/constants";
import { mutationConfig } from "@/utils/mutation-configs";
import {
  getChapterQueryKey,
  getNovelChaptersQueryKey,
} from "@/utils/tanstack-keys/novelChapters";
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
  const baseHandlers = mutationConfig({
    action: DELETE,
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
