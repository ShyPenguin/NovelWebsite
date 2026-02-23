import { z } from "zod";
import { AuthorFactory } from "../../factories/author";

//READ
export const AuthorSchema = AuthorFactory.getSchema();
export const ArrayAuthorSchema = AuthorFactory.array();
export const PaginatedAuthorSchema = AuthorFactory.paginate();

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
  name: AuthorSchema.shape["name"],
});
