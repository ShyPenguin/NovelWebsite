import type { MutateOptions } from "@tanstack/react-query";
import type {
  AuthorDetailDTO,
  AuthorFormDTO,
  AuthorThumbnailDTO,
} from "@repo/contracts/dto/author";
import { authorMutationConfig } from "../utils/author.mutation-config";
import { updateAuthorMutate } from "../api/putAuthor";

export const useAuthorUpdate = (author: AuthorDetailDTO) => {
  const mutation = updateAuthorMutate(author.id);
  const baseHandlers = authorMutationConfig("update");

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      formData,
      options,
    }: {
      formData: AuthorFormDTO;
      options?: MutateOptions<AuthorThumbnailDTO, unknown, AuthorFormDTO>;
    }) =>
      mutation.mutate(
        {
          ...formData,
        },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.({
              data: {
                id: data.id,
                name: data.name,
                novels: author.novels,
              },
              id: data.id,
            });
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
