import { AuthorTable } from "@/infrastructure/db/schemas/authors.ts";
import { WhereResourceFactory } from "@/shared/factories/repository/where.repository.ts";

export const authorWhereMap = {
  id: WhereResourceFactory({ tableId: AuthorTable.id }),
  name: WhereResourceFactory({ tableId: AuthorTable.name }),
};

export type AuthorWhere = keyof typeof authorWhereMap;
