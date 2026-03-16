import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  numeric,
  uuid,
  integer,
  index,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { UserTable } from "./users.js";
import { NovelTable } from "./novels.js";

export const ReviewTable = pgTable(
  "reviews",
  {
    id: uuid().primaryKey().defaultRandom(),
    novelId: uuid()
      .notNull()
      .references(() => NovelTable.id, { onDelete: "cascade" }),
    reviewerId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    rating: numeric("rating", { precision: 2, scale: 1 }) // Allows values like 1.0 to 5.0
      .notNull()
      .$type<number>()
      .default(1),
    review: varchar({ length: 10_000 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    novelIdx: index("novel_idx").on(table.novelId),
    minMaxCheck: sql`CHECK (${table.rating}" >= 1 AND ${table.rating} <= 5)`,
    uniqueNovelReviewer: uniqueIndex("unique_novel_reviewer_idx").on(
      table.novelId,
      table.reviewerId,
    ),
  }),
);

export const reviewsRelations = relations(ReviewTable, ({ one }) => ({
  novel: one(NovelTable, {
    fields: [ReviewTable.novelId],
    references: [NovelTable.id],
  }),
  reviewer: one(UserTable, {
    fields: [ReviewTable.novelId],
    references: [UserTable.id],
  }),
}));
