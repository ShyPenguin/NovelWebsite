import type { MutateOptions } from "@tanstack/react-query";
import type {
  UserDetailDTO,
  UserChangeRoleDTO,
  UserThumbnailDTO,
} from "@repo/contracts/dto/user";
import { updateUserRoleMutate } from "../api/patchUserRole";
import { userMutationConfig } from "../utils/user.mutation-config";

export const useUserChangeRole = (user: UserDetailDTO) => {
  const mutation = updateUserRoleMutate({
    id: user.id,
    username: user.username,
  });
  const baseHandlers = userMutationConfig("changeRole");

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      formData,
      options,
    }: {
      formData: UserChangeRoleDTO;
      options?: MutateOptions<UserThumbnailDTO, unknown, UserChangeRoleDTO>;
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
                  role: data.role,
                  novels: user.novels,
                  updatedAt: user.updatedAt,
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
