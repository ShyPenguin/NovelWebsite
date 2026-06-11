import { ApiResponseSchema } from "@repo/contracts/api";
import { BookmarkDetailSchema } from "@repo/contracts/schemas/bookmark";
import type {
  BookmarkDetailDTO,
  BookmarkFormDTO,
} from "@repo/contracts/dto/bookmark";
import { useMutation } from "@tanstack/react-query";
import { novelUrl } from "@/features/novels/novel.constant";

export const postBookmark = async (
  formData: BookmarkFormDTO,
): Promise<BookmarkDetailDTO> => {
  const response = await fetch(`${novelUrl}/${formData.novelId}/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Important for sending JSON data
    },
    credentials: "include",
  });

  const result = await response.json();

  const parsedResult = ApiResponseSchema(BookmarkDetailSchema).parse(result);

  if (!parsedResult.ok) {
    throw new Error(parsedResult.error.message);
  }

  return parsedResult.data;
};

export const createBookmarkMutate = () => {
  return useMutation({
    mutationKey: ["bookmarks", "create"],
    mutationFn: ({ formData }: { formData: BookmarkFormDTO }) =>
      postBookmark(formData),
  });
};
