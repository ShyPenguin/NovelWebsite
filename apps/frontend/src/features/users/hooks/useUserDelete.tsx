import { userMutationConfig } from "@/features/users/utils/user.mutation-config";
import type { UserDetailDTO } from "@repo/contracts/dto/user";
import type { MutateOptions } from "@tanstack/react-query";
import { deleteUserMutate } from "../api/deleteUser";

export const useUserDelete = (user: {
  id: UserDetailDTO["id"];
  username: UserDetailDTO["username"];
}) => {
  const mutation = deleteUserMutate({ username: user.username });
  const baseHandlers = userMutationConfig("delete");

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      options,
    }: {
      options?: MutateOptions<
        { id: UserDetailDTO["id"] },
        unknown,
        { id: UserDetailDTO["id"] }
      >;
    }) =>
      mutation.mutate(
        {
          id: user.id,
        },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.({ data }, data.id);
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
