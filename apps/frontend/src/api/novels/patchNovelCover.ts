import { useMutation } from "@tanstack/react-query";
import { novelUrl } from "./url";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { ApiResponseSchema } from "@repo/contracts/api";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";
import type { NovelCoverImageForm } from "@/types/novel";

export const patchNovelCover = async ({
  formData,
  novelId,
}: { formData: NovelCoverImageForm } & {
  novelId: string;
}): Promise<NovelDetailDTO> => {
  const formDataConverted = new FormData();
  formDataConverted.append("image", formData.coverImage);

  const response = await fetch(`${novelUrl}/${novelId}/cover`, {
    method: "PATCH",
    body: formDataConverted,
    credentials: "include",
  });

  const result = await response.json();
  const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(result);

  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }
  return parsedResult.data;
};

export const updateNovelCoverMutate = (novelId: NovelDetailDTO["id"]) => {
  return useMutation({
    mutationKey: ["novel", "update", "cover", novelId],
    mutationFn: ({ formData }: { formData: NovelCoverImageForm }) =>
      patchNovelCover({ formData, novelId }),
  });
};
