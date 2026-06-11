import { getNovelOneQueryKey } from "@/features/novels/utils/novels.tanstack-keys";
import { queryClient } from "@/routes";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { useMutation } from "@tanstack/react-query";
import { postBookmark } from "../api/postBookmark";
import { getBookmarksQueryKey } from "../utils/bookmark.tanstack-keys";
import type { BookmarkFormDTO } from "@repo/contracts/dto/bookmark";
import { toast } from "react-toastify";

export const useBookmarkCreate = () => {
  return useMutation({
    mutationKey: ["bookmarks", "create"],
    mutationFn: ({ formData }: { formData: BookmarkFormDTO }) =>
      postBookmark(formData),

    onSuccess: (_, variables) => {
      queryClient.setQueryData<NovelDetailDTO>(
        getNovelOneQueryKey({
          id: variables.formData.novelId,
        }),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            isBookmarked: true,
            bookmarkCount: Number(old.bookmarkCount) + 1,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: getBookmarksQueryKey,
        refetchType: "active",
      });

      toast.success(`Bookmark successfully created`);
    },
  });
};
