import { z } from "zod";
import {
  AuthorDetailSchema,
  AuthorFormSchema,
  AuthorThumbnailSchema,
} from "../schemas/author/schema";

export type AuthorSelectDTO = "detail" | "thumbnail";
export type AuthorListDTO = Extract<AuthorSelectDTO, "detail" | "thumbnail">;
export type AuthorThumbnailDTO = z.infer<typeof AuthorThumbnailSchema>;
export type AuthorFormDTO = z.infer<typeof AuthorFormSchema>;
export type AuthorDetailDTO = z.infer<typeof AuthorDetailSchema>;
