import { useMutation } from "@tanstack/react-query";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { deleteResourceFactory } from "../../../shared/api/delete";

export const deleteChapter = deleteResourceFactory({ resource: "chapters" });

export const deleteChapterMutate = (chapterId: ChapterDetailDTO["id"]) => {
  return useMutation({
    mutationKey: ["chapter", "delete", chapterId],
    mutationFn: ({ chapterId }: { chapterId: ChapterDetailDTO["id"] }) =>
      deleteChapter({ id: chapterId }),
  });
};
