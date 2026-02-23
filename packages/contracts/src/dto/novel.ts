import { z } from "zod";
import {
  NovelDetailSchema,
  NovelFormSchema,
  NovelPosterSchema,
  NovelQueryContract,
  NovelThumbnailSchema,
  NovelTrendSchema,
} from "../schemas/novel/schema";

//TYPES OF DATA TO READ
export type NovelSelectDTO = "detail" | "thumbnail" | "trend" | "poster";
//READ
export type NovelDetailDTO = z.infer<typeof NovelDetailSchema>;
export type NovelDetailEncodeDTO = z.input<typeof NovelDetailSchema>;
export type NovelThumbnailDTO = z.infer<typeof NovelThumbnailSchema>;
export type NovelTrendDTO = z.infer<typeof NovelTrendSchema>;
export type NovelPosterDTO = z.infer<typeof NovelPosterSchema>;

// LISTABLE TYPES (ARRAY OR PAGINATION)
export type NovelListDTO = Extract<
  NovelSelectDTO,
  "thumbnail" | "detail" | "trend" | "poster"
>;
// QUERY
export type NovelQueryContractDTO = z.infer<typeof NovelQueryContract>;
// WRITE
export type NovelFormDTO = z.infer<typeof NovelFormSchema>;
export type NovelFormInputDTO = z.input<typeof NovelFormSchema>;
