import { authorMutationConfig } from "@/features/authors/utils/author.mutation-config";
import type { AuthorDetailDTO } from "@repo/contracts/dto/author";
import type { MutateOptions } from "@tanstack/react-query";
import { deleteAuthorMutate } from "../api/deleteAuthor";

export const useAuthorDelete = ({ id }: { id: AuthorDetailDTO["id"] }) => {
  const mutation = deleteAuthorMutate(id);
  const baseHandlers = authorMutationConfig("delete");

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      options,
    }: {
      options?: MutateOptions<
        { id: AuthorDetailDTO["id"] },
        unknown,
        { authorId: AuthorDetailDTO["id"] }
      >;
    }) =>
      mutation.mutate(
        {
          authorId: id,
        },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.({ data, id: data.id });
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
