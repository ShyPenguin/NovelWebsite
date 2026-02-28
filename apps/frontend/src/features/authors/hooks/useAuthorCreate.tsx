import type { MutateOptions } from "@tanstack/react-query";
import { createAuthorMutate } from "../api/postAuthor";
import type {
  AuthorFormDTO,
  AuthorThumbnailDTO,
} from "@repo/contracts/dto/author";
import { authorMutationConfig } from "../utils/author.mutation-config";

export const useAuthorCreate = () => {
  const mutation = createAuthorMutate();
  const baseHandlers = authorMutationConfig("create");

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
          // Backend does not return a novels field so we optimisticall update it
          // We know that when creating an author
          // It does not have novels assosciated with it
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.({
              data: {
                ...data,
                novels: [],
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
