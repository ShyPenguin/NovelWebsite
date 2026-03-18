import {
  AuthorThumbnailSchema,
  AuthorFormSchema,
  AuthorDetailSchema,
} from "@/schemas/author/schema.js";
import { z } from "zod";

export type AuthorSelectDTO = "detail" | "thumbnail";
export type AuthorListDTO = Extract<AuthorSelectDTO, "detail" | "thumbnail">;
export type AuthorThumbnailDTO = z.infer<typeof AuthorThumbnailSchema>;
export type AuthorFormDTO = z.infer<typeof AuthorFormSchema>;
export type AuthorDetailDTO = z.infer<typeof AuthorDetailSchema>;
