import { NovelTable } from "@/infrastructure/db/schemas/novels.ts";
import { WhereResourceFactory } from "@/shared/factories/repository/where.repository.ts";

export const novelWhereMap = {
  id: WhereResourceFactory({ tableId: NovelTable.id }),
};

export type NovelWhere = keyof typeof novelWhereMap;
