import { previewChapterMutate } from "@/features/chapters/api/postChapter";

import type {
  ChapterFormParsedDTO,
  ChapterDetailDTO,
  ChapterPreviewDTO,
} from "@repo/contracts/dto/chapter";
import type { MutateOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useChapterPreview = () => {
  const mutation = previewChapterMutate();

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      formData,
      novelId,
      options,
    }: {
      formData: ChapterFormParsedDTO;
      novelId: ChapterDetailDTO["novelId"];
      options?: MutateOptions<
        ChapterPreviewDTO,
        unknown,
        { formData: ChapterFormParsedDTO }
      >;
    }) =>
      mutation.mutate(
        {
          formData,
          novelId: novelId,
        },
        {
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            options?.onSuccess?.(data, vars, onResult, ctx);
          },
          onError(error, vars, onResult, ctx) {
            toast.error(error.message);
            options?.onError?.(error, vars, onResult, ctx);
          },
        },
      ),

    ...rest,
  };
};
