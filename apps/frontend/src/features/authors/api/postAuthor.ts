import { useMutation } from "@tanstack/react-query";
import { getAuthorCreateKey } from "../utils/authors.tanstack-keys";
import { urlApiRoute } from "../author.constant";
import type {
  AuthorFormDTO,
  AuthorThumbnailDTO,
} from "@repo/contracts/dto/author";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AuthorThumbnailSchema } from "@repo/contracts/schemas/author";

export const postAuthor = async (
  formData: AuthorFormDTO,
): Promise<AuthorThumbnailDTO> => {
  const response = await fetch(`${urlApiRoute}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

export const createAuthorMutate = () => {
  return useMutation({
    mutationKey: getAuthorCreateKey,
    mutationFn: postAuthor,
  });
};
