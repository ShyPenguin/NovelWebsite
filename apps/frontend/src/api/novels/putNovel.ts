import { useMutation } from "@tanstack/react-query";
import type { NovelFormUpdateData } from "../../types";
import { novelUrl } from "./url";
import type { NovelDetailDTO, NovelFormDTO } from "@repo/contracts/dto/novel";
import {
  NovelDetailSchema,
  NovelFormSchema,
} from "@repo/contracts/schemas/novel";
import { ApiResponseSchema } from "@repo/contracts/api";

export const putNovel = async ({
  formData,
  novelId,
}: NovelFormUpdateData): Promise<NovelDetailDTO> => {
  const response = await fetch(`${novelUrl}/${novelId}`, {
    method: "PUT",
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

export const updateNovelMutate = (novelId: NovelDetailDTO["id"]) => {
  return useMutation({
    mutationKey: ["novels", "update", novelId],
    mutationFn: ({ formData }: { formData: NovelFormDTO }) =>
      putNovel({ formData, novelId }),
  });
};
