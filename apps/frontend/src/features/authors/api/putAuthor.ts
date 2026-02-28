import type {
  AuthorDetailDTO,
  AuthorFormDTO,
  AuthorThumbnailDTO,
} from "@repo/contracts/dto/author";
import { urlApiRoute } from "../author.constant";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AuthorThumbnailSchema } from "@repo/contracts/schemas/author";
import { getAuthorUpdateKey } from "../utils/authors.tanstack-keys";
import { useMutation } from "@tanstack/react-query";

type AuthorUpdateForm = {
  formData: AuthorFormDTO;
  id: AuthorDetailDTO["id"];
};
export const putAuthor = async ({
  formData,
  id,
}: AuthorUpdateForm): Promise<AuthorThumbnailDTO> => {
  const response = await fetch(`${urlApiRoute}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Important for sending JSON data
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const result = await response.json();

  const parsedResult = ApiResponseSchema(AuthorThumbnailSchema).parse(result);
  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }
  return parsedResult.data;
};

export const updateAuthorMutate = (id: AuthorDetailDTO["id"]) => {
  return useMutation({
    mutationKey: getAuthorUpdateKey({ id }),
    mutationFn: (formData: AuthorFormDTO) => putAuthor({ formData, id }),
  });
};
