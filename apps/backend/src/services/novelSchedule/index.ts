import { db } from "../../db/index.ts";
import {
  NovelScheduleTable,
  weekDayEnum,
} from "../../db/schemas/novelSchedule.ts";
import { eq } from "drizzle-orm";
import { ServiceResult } from "../../types/index.ts";
import { upsertNovelScheduleTx } from "../../repositories/novelSchedule/index.ts";

export type WeekDay = (typeof weekDayEnum.enumValues)[number];

export type CreateNovelScheduleInput = {
  novelId: string;
  days: WeekDay[];
};

export const createNovelScheduleService = async ({
  novelId,
  days,
}: CreateNovelScheduleInput): Promise<ServiceResult<any>> => {
  try {
    const result = await db.transaction(async (trx) => {
      const inserted = await upsertNovelScheduleTx(trx, novelId, days);
      return inserted;
    });

    return { success: true, data: result };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};
