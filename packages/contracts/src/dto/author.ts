import { z } from "zod";
import { AuthorFormSchema, AuthorSchema } from "../schemas/author/schema";

export type AuthorSelectDTO = "detail";
export type AuthorListDTO = Extract<AuthorSelectDTO, "detail">;
export type AuthorDTO = z.infer<typeof AuthorSchema>;
export type AuthorFormDTO = z.infer<typeof AuthorFormSchema>;
