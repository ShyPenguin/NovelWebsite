import { useMutation } from "@tanstack/react-query";
import type { UserDetailDTO } from "@repo/contracts/dto/user";
import { ApiResponseSchema } from "@repo/contracts/api";
import { UserDetailSchema } from "@repo/contracts/schemas/user";
import { userUrl } from "../user.constant";
import type { UserImageForm } from "../user.schema";

export const patchUserCover = async ({
  formData,
  userId,
}: { formData: UserImageForm } & {
  userId: string;
}): Promise<UserDetailDTO> => {
  const formDataConverted = new FormData();
  formDataConverted.append("image", formData.imageUrl);

  const response = await fetch(`${userUrl}/${userId}/image`, {
    method: "PATCH",
    body: formDataConverted,
    credentials: "include",
  });

  const result = await response.json();
  const parsedResult = ApiResponseSchema(UserDetailSchema).parse(result);

  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }
  return parsedResult.data;
};

export const updateUserImageMutate = (userId: UserDetailDTO["id"]) => {
  return useMutation({
    mutationKey: ["user", userId, "update", "cover"],
    mutationFn: ({ formData }: { formData: UserImageForm }) =>
      patchUserCover({ formData, userId }),
  });
};
