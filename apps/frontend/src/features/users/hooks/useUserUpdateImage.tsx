import type { UserDetailDTO } from "@repo/contracts/dto/user";
import type { MutateOptions } from "@tanstack/react-query";
import { mutationConfig } from "@/shared/utils/mutation-configs";
import {
  getUserOneQueryKey,
  getUsersQueryKey,
} from "@/features/users/utils/user.tanstack-keys";
import { updateUserImageMutate } from "../api/patchUserImage";
import type { UserImageForm } from "../user.schema";

export const useUserUpdateImage = ({
  userId,
}: {
  userId: UserDetailDTO["id"];
}) => {
  const mutation = updateUserImageMutate(userId);
  const { mutate: _removed, ...rest } = mutation;
  const baseHandlers = mutationConfig({
    action: "update",
    resource: "users",
    queryArg: {
      getListQueryKey: () => getUsersQueryKey,
      exact: false,
    },
    getQueryKey: getUserOneQueryKey,
  });
  return {
    mutate: ({
      formData,
      options,
    }: {
      formData: UserImageForm;
      options?: MutateOptions<
        UserDetailDTO,
        unknown,
        { formData: UserImageForm }
      >;
    }) =>
      mutation.mutate(
        { formData },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.({ data }, data.username);
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
