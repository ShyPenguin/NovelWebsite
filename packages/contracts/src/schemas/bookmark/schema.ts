import {
  BookmarkAuthFactory,
  BookmarkDetailFactory,
} from "@/factories/bookmark/index.js";
import { z } from "zod";

// READ
export const BookmarkDetailSchema = BookmarkDetailFactory.getSchema();
export const BookmarkAuthSchema = BookmarkAuthFactory.getSchema();

// READ - ARRAY
export const ArrayBookmarkDetailSchema = BookmarkDetailFactory.array();
export const ArrayBookmarkAuthSchema = BookmarkAuthFactory.array();

// READ - PAGINATE
export const PaginatedBookmarkDetailSchema = BookmarkDetailFactory.paginate();
export const PaginatedBookmarkAuthSchema = BookmarkAuthFactory.paginate();

export const BookmarkQueryContract = z.object({
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});
