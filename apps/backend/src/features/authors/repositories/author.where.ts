import { AuthorTable } from "@/infrastructure/db/schemas/authors.js";
import { WhereResourceFactory } from "@/shared/factories/repository/where.repository.js";

export const authorWhereMap = {
  id: WhereResourceFactory({ tableId: AuthorTable.id }),
  name: WhereResourceFactory({ tableId: AuthorTable.name }),
};

export type AuthorWhere = keyof typeof authorWhereMap;
