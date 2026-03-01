import { useMutation } from "@tanstack/react-query";
import { BackendApiLink } from "../../../shared/constants";
import type { ChapterUpdateData } from "../chapter.type";
import type {
  ChapterDetailDTO,
  ChapterFormParsedDTO,
} from "@repo/contracts/dto/chapter";
import { ApiResponseSchema } from "@repo/contracts/api";
import {
  ChapterDetailSchema,
  ChapterFormSchema,
} from "@repo/contracts/schemas/chapter";

export const putChapter = async ({
  formData,
  chapterId,
}: ChapterUpdateData): Promise<ChapterDetailDTO> => {
  const response = await fetch(`${BackendApiLink}/chapters/${chapterId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Important for sending JSON data
    },
    body: JSON.stringify(ChapterFormSchema.encode(formData)),
    credentials: "include",
  });

  const result = await response.json();

  const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(result);
  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }
  return parsedResult.data;
};

export const updateChapterMutate = (chapterId: ChapterDetailDTO["id"]) => {
  return useMutation({
    mutationKey: ["chapter", "update", chapterId],
    mutationFn: ({ formData }: { formData: ChapterFormParsedDTO }) =>
      putChapter({ formData, chapterId }),
  });
};
