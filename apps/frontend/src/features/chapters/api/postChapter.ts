import { useMutation } from "@tanstack/react-query";
import type { ChapterInsertData } from "../chapter.type";
import { ApiResponseSchema } from "@repo/contracts/api";
import {
  ChapterDetailSchema,
  ChapterFormSchema,
  ChapterPreviewSchema,
} from "@repo/contracts/schemas/chapter";
import { ZodType } from "zod";
import type {
  ChapterDetailDTO,
  ChapterPreviewDTO,
} from "@repo/contracts/dto/chapter";
import { BackendApiLink } from "@/shared/constants";

type Map = {
  create: ChapterDetailDTO;
  preview: ChapterPreviewDTO;
};

export const createPreviewChapter =
  <T extends keyof Map>({ type, schema }: { type: T; schema: ZodType }) =>
  async ({ formData, novelId }: ChapterInsertData): Promise<Map[T]> => {
    const response = await fetch(
      `${BackendApiLink}/novels/${novelId}/chapters/${type == "preview" ? type : ""}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Important for sending JSON data
        },
        body: JSON.stringify(ChapterFormSchema.encode(formData)),
        credentials: "include",
      },
    );

    const result = await response.json();
    const parsedResult = ApiResponseSchema(schema).parse(result);
    if (!parsedResult.ok) {
      throw new Error(parsedResult.error.message);
    }
    return parsedResult.data as Map[T];
  };

const previewChapter = createPreviewChapter({
  type: "preview",
  schema: ChapterPreviewSchema,
});

const postChapter = createPreviewChapter({
  type: "create",
  schema: ChapterDetailSchema,
});

export const createChapterMutateKey = ["chapter", "create"];
export const createChapterMutate = () => {
  return useMutation({
    mutationKey: createChapterMutateKey, // Add a mutation key
    mutationFn: ({ formData, novelId }: ChapterInsertData) =>
      postChapter({
        formData,
        novelId,
      }),
  });
};

export const previewChapterMutateKey = ["chapter", "preview"];
export const previewChapterMutate = () => {
  return useMutation({
    mutationKey: previewChapterMutateKey, // Add a mutation key
    mutationFn: ({ formData, novelId }: ChapterInsertData) =>
      previewChapter({
        formData,
        novelId,
      }),
  });
};
