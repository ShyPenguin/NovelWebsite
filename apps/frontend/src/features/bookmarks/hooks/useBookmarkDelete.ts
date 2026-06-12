import { getNovelOneQueryKey } from "@/features/novels/utils/novels.tanstack-keys";
import { queryClient } from "@/routes";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { useMutation } from "@tanstack/react-query";
import { getBookmarksQueryKey } from "../utils/bookmark.tanstack-keys";
import type { BookmarkFormDTO } from "@repo/contracts/dto/bookmark";
import { toast } from "react-toastify";
import { deleteBookmark } from "../api/deleteBookmark";

export const useBookmarkDelete = () => {
  return useMutation({
    mutationKey: ["bookmark", "delete"],
    mutationFn: ({ novelId }: BookmarkFormDTO) =>
      deleteBookmark({ id: novelId }),

    onSuccess: (_, variables) => {
      queryClient.setQueryData<NovelDetailDTO>(
        getNovelOneQueryKey({
          id: variables.novelId,
        }),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            isBookmarked: false,
            bookmarkCount: Number(old.bookmarkCount) - 1,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: getBookmarksQueryKey,
        refetchType: "active",
      });

      toast.success(`Bookmark successfully deleted`);
    },
  });
};
