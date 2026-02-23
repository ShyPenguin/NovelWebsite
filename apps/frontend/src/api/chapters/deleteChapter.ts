import { useMutation } from "@tanstack/react-query";
import { BackendApiLink } from "../../constants";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { ApiResponseSchema } from "@repo/contracts/api";
import { idField } from "@/types/fields";

export const deleteChapter = async ({
  chapterId,
}: {
  chapterId: ChapterDetailDTO["id"];
}): Promise<any> => {
  const response = await fetch(`${BackendApiLink}/chapters/${chapterId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Important for sending JSON data
    },
    credentials: "include",
  });

  const result = await response.json();
  const parsedResult = ApiResponseSchema(idField).parse(result);
  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};

export const deleteChapterMutate = (chapterId: ChapterDetailDTO["id"]) => {
  return useMutation({
    mutationKey: ["chapter", "delete", chapterId],
    mutationFn: ({ chapterId }: { chapterId: ChapterDetailDTO["id"] }) =>
      deleteChapter({ chapterId }),
  });
};
