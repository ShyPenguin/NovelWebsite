import { useMutation } from "@tanstack/react-query";
import type { UserDetailDTO } from "@repo/contracts/dto/user";
import { deleteResourceFactory } from "@/shared/api/delete";

export const deleteUser = deleteResourceFactory({ resource: "users" });

export const deleteUserMutate = (username: UserDetailDTO["username"]) => {
  return useMutation({
    mutationKey: ["user", "delete", username],
    mutationFn: ({ username }: { username: UserDetailDTO["username"] }) =>
      deleteUser({ id: username }),
  });
};
