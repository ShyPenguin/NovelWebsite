import {
  NovelDetailSchema,
  NovelThumbnailSchema,
  NovelTrendSchema,
  NovelAuthSchema,
  NovelQueryContract,
  NovelFormSchema,
} from "@/schemas/novel/schema.js";
import { z } from "zod";

//TYPES OF DATA TO READ
export type NovelSelectDTO = "detail" | "thumbnail" | "trend" | "auth";
//READ
export type NovelDetailDTO = z.infer<typeof NovelDetailSchema>;
export type NovelDetailEncodeDTO = z.input<typeof NovelDetailSchema>;
export type NovelThumbnailDTO = z.infer<typeof NovelThumbnailSchema>;
export type NovelTrendDTO = z.infer<typeof NovelTrendSchema>;
export type NovelAuthDTO = z.infer<typeof NovelAuthSchema>;

// LISTABLE TYPES (ARRAY OR PAGINATION)
export type NovelListDTO = Extract<
  NovelSelectDTO,
  "thumbnail" | "detail" | "trend" | "auth"
>;
// QUERY
export type NovelQueryContractDTO = z.infer<typeof NovelQueryContract>;
// WRITE
export type NovelFormDTO = z.infer<typeof NovelFormSchema>;
export type NovelFormInputDTO = z.input<typeof NovelFormSchema>;
