import { deleteResourceFactory } from "@/shared/api/delete";
import type {
  BookmarkDetailDTO,
  BookmarkFormDTO,
} from "@repo/contracts/dto/bookmark";
import { useMutation } from "@tanstack/react-query";

export const deleteBookmark = deleteResourceFactory({ resource: "bookmarks" });

export const deleteBookmarkMutate = (
  novelId: BookmarkDetailDTO["novel"]["id"],
) => {
  return useMutation({
    mutationKey: ["bookmark", "delete", novelId],
    mutationFn: ({ novelId }: BookmarkFormDTO) =>
      deleteBookmark({ id: novelId }),
  });
};
