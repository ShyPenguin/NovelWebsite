import {
  AnnouncementDetailSchema,
  AnnouncementThumbnailSchema,
  AnnouncementAuthSchema,
  AnnouncementFormSchema,
  AnnouncementQueryContract,
} from "@/schemas/announcement/schema.js";
import { z } from "zod";

//TYPES OF DATA TO READ
export type AnnouncementSelectDTO = "detail" | "thumbnail" | "auth";
// READ
export type AnnouncementDetailDTO = z.infer<typeof AnnouncementDetailSchema>;
export type AnnouncementDetailEncodeDTO = z.input<
  typeof AnnouncementDetailSchema
>;

export type AnnouncementThumbnailDTO = z.infer<
  typeof AnnouncementThumbnailSchema
>;
export type AnnouncementAuthDTO = z.infer<typeof AnnouncementAuthSchema>;

// LISTABLE TYPES (ARRAY OR PAGINATION)
export type AnnouncementListDTO = Extract<AnnouncementSelectDTO, "thumbnail">;

// QUERY
export type AnnouncementQueryContractDTO = z.infer<
  typeof AnnouncementQueryContract
>;
// WRITE
export type AnnouncementFormDTO = z.input<typeof AnnouncementFormSchema>;
export type AnnouncementFormParsedDTO = z.infer<typeof AnnouncementFormSchema>;
