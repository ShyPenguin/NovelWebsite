import type { MutateOptions } from "@tanstack/react-query";
import type {
  UserDetailDTO,
  UserFormDTO,
  UserThumbnailDTO,
} from "@repo/contracts/dto/user";
import { userMutationConfig } from "../utils/user.mutation-config";
import { updateUserMutate } from "../api/patchUser";

export const useUserUpdate = (user: UserDetailDTO) => {
  const mutation = updateUserMutate({ id: user.id, username: user.username });
  const baseHandlers = userMutationConfig("update");

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      formData,
      options,
    }: {
      formData: UserFormDTO;
      options?: MutateOptions<UserThumbnailDTO, unknown, UserFormDTO>;
    }) =>
      mutation.mutate(
        {
          ...formData,
        },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.(
              {
                data: {
                  id: data.id,
                  name: data.name,
                  novels: user.novels,
                },
              },
              data.username,
            );
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
