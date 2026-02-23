import { z } from "zod";
import {
  ChapterDetailSchema,
  ChapterFormSchema,
  ChapterPosterSchema,
  ChapterPreviewSchema,
  ChapterSearchQueryContract,
  ChapterThumbnailSchema,
} from "../schemas/chapter/schema";

//TYPES OF DATA TO READ
export type ChapterSelectDTO = "detail" | "thumbnail" | "poster";
// READ
export type ChapterDetailDTO = z.infer<typeof ChapterDetailSchema>;
export type ChapterDetailEncodeDTO = z.input<typeof ChapterDetailSchema>;

export type ChapterThumbnailDTO = z.infer<typeof ChapterThumbnailSchema>;
export type ChapterPosterDTO = z.infer<typeof ChapterPosterSchema>;

// LISTABLE TYPES (ARRAY OR PAGINATION)
export type ChapterListDTO = Extract<ChapterSelectDTO, "thumbnail">;

// QUERY
export type ChapterSearchQueryContractDTO = z.infer<
  typeof ChapterSearchQueryContract
>;
// WRITE
export type ChapterFormDTO = z.input<typeof ChapterFormSchema>;
export type ChapterFormParsedDTO = z.infer<typeof ChapterFormSchema>;

export type ChapterPreviewDTO = z.infer<typeof ChapterPreviewSchema>;
export type ChapterPreviewEncodeDTO = z.input<typeof ChapterPreviewSchema>;
