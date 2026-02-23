import { eq } from "drizzle-orm";
import { NovelScheduleTable } from "../../db/schemas/index.ts";
import { WeekDay } from "../../services/novelSchedule/index.ts";
import type { DbExecTypes } from "../../db/type.ts";

export const upsertNovelScheduleTx = async (
  trx: DbExecTypes,
  novelId: string,
  days: WeekDay[],
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
