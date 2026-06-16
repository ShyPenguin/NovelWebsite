import { deleteResourceFactory } from "@/shared/api/delete";

export const deleteBookmark = deleteResourceFactory({ resource: "bookmarks" });

// export const deleteBookmarkMutate = (
//   novelId: BookmarkDetailDTO["novel"]["id"],
// ) => {
//   return useMutation({
//     mutationKey: ["bookmark", "delete", novelId],
//     mutationFn: ({ novelId }: BookmarkFormDTO) =>
//       deleteBookmark({ id: novelId }),
//   });
// };
