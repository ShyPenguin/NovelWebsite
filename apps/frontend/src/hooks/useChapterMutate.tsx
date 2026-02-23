import { useNavigate } from "@tanstack/react-router";
import { createChapterMutate } from "../api/chapters/postChapter";
import { updateChapterMutate } from "../api/chapters/putChapter";
import type { ChapterInsertData, ChapterUpdateData } from "../types/chapter";
import { queryClient } from "../routes";
import type {
  ChapterDetailDTO,
  ChapterFormParsedDTO,
} from "@repo/contracts/dto/chapter";
import { mutationConfig } from "@/utils/mutation-configs";
import type { MutateOptions } from "@tanstack/react-query";
import {
  getChapterQueryKey,
  getNovelChaptersQueryKey,
} from "@/utils/tanstack-keys/novelChapters";
import { CREATE, UPDATE } from "@/constants";

export const useChapterMutate = (chapter: ChapterDetailDTO | null) => {
  const { mutate, isPending } = createChapterMutate();
  const update = chapter ? updateChapterMutate(chapter.id) : null;

  const navigate = useNavigate();

  return {
    mutate: (data: ChapterInsertData | ChapterUpdateData) => {
      if (!chapter) {
        return mutate(data as ChapterInsertData, {
          onSuccess: async (data) => {
            await queryClient.invalidateQueries({
              queryKey: ["chapters", data.chapter.novelId, 1, "desc", ""],
              exact: true,
            });

            navigate({
              to: "/novels/$novelId/chapters/$chapterId",
              params: {
                chapterId: data.chapter.id,
                novelId: data.chapter.novelId,
              },
            });
          },
        });
      } else {
        return update!.mutate(
          { ...data },
          {
            onSuccess: () => {
              queryClient.removeQueries({
                queryKey: ["chapter", chapter!.id],
                exact: true,
              });
              navigate({
                to: "/novels/$novelId/chapters/$chapterId",
                params: { chapterId: chapter!.id, novelId: chapter!.novelId },
              });
            },
          },
        );
      }
    },
    isPending: !chapter ? isPending : update!.isPending,
  };
};

export const useTestMutate = (chapter: ChapterDetailDTO | null) => {
  const mutation = chapter
    ? updateChapterMutate(chapter.id)
    : createChapterMutate();
  const baseHandlers = mutationConfig({
    action: chapter ? UPDATE : CREATE,
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
      id,
      options,
    }: {
      formData: ChapterFormParsedDTO;
      id?: ChapterDetailDTO["id"];
      options?: MutateOptions<
        ChapterDetailDTO,
        unknown,
        { formData: ChapterFormParsedDTO }
      >;
    }) =>
      mutation.mutate(
        { formData, novelId: id || "" },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.(data);
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
