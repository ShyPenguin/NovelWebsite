import { useMutation } from "@tanstack/react-query";
import type { AuthorDetailDTO } from "@repo/contracts/dto/author";
import { deleteResourceFactory } from "@/shared/api/delete";

export const deleteAuthor = deleteResourceFactory({ resource: "authors" });

export const deleteAuthorMutate = (authorId: AuthorDetailDTO["id"]) => {
  return useMutation({
    mutationKey: ["author", "delete", authorId],
    mutationFn: ({ authorId }: { authorId: AuthorDetailDTO["id"] }) =>
      deleteAuthor({ id: authorId }),
  });
};
