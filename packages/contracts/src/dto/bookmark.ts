import {
  BookmarkAuthSchema,
  BookmarkDetailSchema,
  BookmarkFormSchema,
  BookmarkQueryContract,
} from "@/schemas/bookmark/schema.js";
import { z } from "zod";

// TYPES OF DATA TO READ
export type BookmarkSelectDTO = "detail" | "auth";

// READ
export type BookmarkDetailDTO = z.infer<typeof BookmarkDetailSchema>;
export type BookmarkAuthDTO = z.infer<typeof BookmarkAuthSchema>;

// LISTABLE TYPES (ARRAY OR PAGINATION)
export type BookmarkListDTO = Extract<BookmarkSelectDTO, "detail">;

// QUERY
export type BookmarkSearchQueryContractDTO = z.infer<
  typeof BookmarkQueryContract
>;

// WRITE
export type BookmarkFormDTO = z.infer<typeof BookmarkFormSchema>;
