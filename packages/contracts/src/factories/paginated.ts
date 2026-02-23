import { z } from "zod";

export const createPaginatedSchema = <T extends z.ZodType>(schema: T) => {
  return z.object({
    items: z.array(schema), // The generic part
    currentPage: z.coerce.number(),
    totalPage: z.coerce.number(),
  });
};
