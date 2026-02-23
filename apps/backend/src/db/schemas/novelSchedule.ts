import {
  pgEnum,
  pgTable,
  uniqueIndex,
  uuid,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { NovelTable } from "./index.ts";
import { relations } from "drizzle-orm/relations";

export const weekDay = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;

export const weekDayEnum = pgEnum("week_day", weekDay);

export const NovelScheduleTable = pgTable(
  "novel_schedules",
  {
    novelId: uuid()
      .notNull()
      .references(() => NovelTable.id, { onDelete: "cascade" }),
    day: weekDayEnum("day").notNull(),
  },
  (t) => ({
    id: primaryKey({ columns: [t.novelId, t.day] }),
    novelSchedulesNovelId: index("idx_novel_schedule_novel_id").on(t.novelId),
  })
);

export const novelScheduleRelation = relations(
  NovelScheduleTable,
  ({ one }) => ({
    novel: one(NovelTable, {
      fields: [NovelScheduleTable.novelId],
      references: [NovelTable.id],
    }),
  })
);
