import { AuthorTable } from "@/infrastructure/db/schemas/authors.js";
import { eq } from "drizzle-orm";

export const authorWhereMap = {
  id: ({ id }: { id: string }) => eq(AuthorTable.id, id),
  name: ({ name }: { name: string }) => eq(AuthorTable.name, name),
};

export type AuthorWhere = typeof authorWhereMap;
