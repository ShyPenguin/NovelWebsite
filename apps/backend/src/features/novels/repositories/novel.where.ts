import { NovelTable } from "@/infrastructure/db/schemas/novels.js";
import { eq } from "drizzle-orm";

export const novelWhereMap = {
  id: ({ id }: { id: string }) => eq(NovelTable.id, id),
};

export type NovelWhere = typeof novelWhereMap;
