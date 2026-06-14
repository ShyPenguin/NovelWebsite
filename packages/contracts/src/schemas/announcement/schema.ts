import {
  AnnouncementDetailFactory,
  AnnouncementThumbnailFactory,
  AnnouncementAuthFactory,
} from "@/factories/announcement/index.js";
import { z } from "zod";

// READ
export const AnnouncementDetailSchema = AnnouncementDetailFactory.getSchema();
export const AnnouncementThumbnailSchema =
  AnnouncementThumbnailFactory.getSchema();
export const AnnouncementAuthSchema = AnnouncementAuthFactory.getSchema();

// READ - ARRAY AND PAGE
export const PaginatedAnnouncementThumbnailSchema =
  AnnouncementThumbnailFactory.paginate();
export const ArrayAnnouncementThumbnailSchema =
  AnnouncementThumbnailFactory.array();

// WRITE
export const AnnouncementFormSchema = z.object({
  title: AnnouncementDetailSchema.shape["title"],
  content: AnnouncementDetailSchema.shape["content"],
});

export const AnnouncementQueryContract = z.object({
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});
