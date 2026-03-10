import type {
  UserDetailDTO,
  UserFormDTO,
  UserThumbnailDTO,
} from "@repo/contracts/dto/user";
import { ApiResponseSchema } from "@repo/contracts/api";
import { UserThumbnailSchema } from "@repo/contracts/schemas/user";
import { getUserUpdateKey } from "../utils/user.tanstack-keys";
import { useMutation } from "@tanstack/react-query";
import { userUrl } from "../user.constant";

type UserUpdateForm = {
  formData: UserFormDTO;
  id: UserDetailDTO["id"];
};
export const patchUser = async ({
  formData,
  id,
}: UserUpdateForm): Promise<UserThumbnailDTO> => {
  const response = await fetch(`${userUrl}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json", // Important for sending JSON data
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const result = await response.json();

  const parsedResult = ApiResponseSchema(UserThumbnailSchema).parse(result);
  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }
  return parsedResult.data;
};

export const updateUserMutate = ({
  id,
  username,
}: {
  id: UserDetailDTO["id"];
  username: UserDetailDTO["username"];
}) => {
  return useMutation({
    mutationKey: getUserUpdateKey(username),
    mutationFn: (formData: UserFormDTO) => patchUser({ formData, id }),
  });
};
