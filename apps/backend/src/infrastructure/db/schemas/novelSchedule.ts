import { pgEnum, pgTable, uuid, index, primaryKey } from "drizzle-orm/pg-core";
import { NovelTable } from "./index.js";
import { relations } from "drizzle-orm/relations";
import { week } from "@repo/contracts/fields/novel";

export const weekDayEnum = pgEnum("week_day", week);

export type Week = (typeof week)[number];

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
  }),
);

export const novelScheduleRelation = relations(
  NovelScheduleTable,
  ({ one }) => ({
    novel: one(NovelTable, {
      fields: [NovelScheduleTable.novelId],
      references: [NovelTable.id],
    }),
  }),
);
