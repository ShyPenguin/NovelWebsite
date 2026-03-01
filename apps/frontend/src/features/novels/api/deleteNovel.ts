import { deleteResourceFactory } from "@/shared/api/delete";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { useMutation } from "@tanstack/react-query";

export const deleteNovel = deleteResourceFactory({ resource: "novels" });

export const deleteNovelMutate = (novelId: NovelDetailDTO["id"]) => {
  return useMutation({
    mutationKey: ["chapter", "delete", novelId],
    mutationFn: ({ novelId }: { novelId: NovelDetailDTO["id"] }) =>
      deleteNovel({ id: novelId }),
  });
};
