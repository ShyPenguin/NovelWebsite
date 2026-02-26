import {
  NovelScheduleTable,
  Week,
} from "@/infrastructure/db/schemas/novelSchedule.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { eq } from "drizzle-orm";

export const upsertNovelScheduleTx = async (
  trx: DbExecTypes,
  novelId: string,
  days: Week[],
) => {
  const uniqueDays = [...new Set(days)];

  await trx
    .delete(NovelScheduleTable)
    .where(eq(NovelScheduleTable.novelId, novelId));

  if (days.length === 0) {
    return [];
  }

  const values = uniqueDays.map((day) => ({
    novelId,
    day,
  }));

  return trx.insert(NovelScheduleTable).values(values).returning();
};
