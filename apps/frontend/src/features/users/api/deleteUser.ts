import { useMutation } from "@tanstack/react-query";
import type { UserDetailDTO } from "@repo/contracts/dto/user";
import { deleteResourceFactory } from "@/shared/api/delete";

export const deleteUser = deleteResourceFactory({ resource: "users" });

export const deleteUserMutate = ({
  username,
}: {
  username: UserDetailDTO["username"];
}) => {
  return useMutation({
    mutationKey: ["user", "delete", username],
    mutationFn: ({ id }: { id: UserDetailDTO["id"] }) => deleteUser({ id: id }),
  });
};
