import { useMutation } from "@tanstack/react-query";
import { novelUrl } from "./url";
import type { NovelDetailDTO, NovelFormDTO } from "@repo/contracts/dto/novel";
import {
  NovelDetailSchema,
  NovelFormSchema,
} from "@repo/contracts/schemas/novel";
import { ApiResponseSchema } from "@repo/contracts/api";

export const postNovel = async (
  formData: NovelFormDTO,
): Promise<NovelDetailDTO> => {
  const response = await fetch(`${novelUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Important for sending JSON data
    },
    body: JSON.stringify(NovelFormSchema.encode(formData)),
    credentials: "include",
  });

  const result = await response.json();

  const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(result);

  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};

export const createNovelMutate = () => {
  return useMutation({
    mutationKey: ["novels", "create"],
    mutationFn: ({ formData }: { formData: NovelFormDTO }) =>
      postNovel(formData),
  });
};
