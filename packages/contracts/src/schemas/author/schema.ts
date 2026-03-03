import { z } from "zod";
import { AuthorDetailFactory, AuthorFactory } from "../../factories/author";

//READ
export const AuthorDetailSchema = AuthorDetailFactory.getSchema();
export const ArrayAuthorDetailScehma = AuthorDetailFactory.getSchema();
export const PaginatedAuthorDetailSchema = AuthorDetailFactory.paginate();
export const AuthorThumbnailSchema = AuthorFactory.getSchema();
export const ArrayAuthorThumbnailSchema = AuthorFactory.array();
export const PaginatedAuthorThumbnailSchema = AuthorFactory.paginate();

// QUERY
export const AuthorQueryContract = z
  .object({
    page: z.coerce.number().optional(),
    pageSize: z.coerce.number().optional(),
    search: z.string().optional(),
  })
  .strict();
// WRITE
export const AuthorFormSchema = z.object({
  name: AuthorThumbnailSchema.shape["name"],
});
