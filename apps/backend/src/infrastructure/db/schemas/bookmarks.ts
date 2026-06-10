import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { NovelTable } from "./novels.js";
import { UserTable } from "./users.js";
import { relations } from "drizzle-orm/relations";

export const BookmarksTable = pgTable(
  "bookmarks",
  {
    novelId: uuid()
      .references(() => NovelTable.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid()
      .references(() => UserTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      id: primaryKey({
        columns: [table.userId, table.novelId],
      }),
      idx_novel_id: index("idx_bookmarks_novel_id").on(table.novelId),
      idx_user_id: index("idx_bookmarks_user_id").on(table.userId),
    };
  },
);

export const bookmarksRelation = relations(BookmarksTable, ({ one }) => ({
  novel: one(NovelTable, {
    fields: [BookmarksTable.novelId],
    references: [NovelTable.id],
  }),
  user: one(UserTable, {
    fields: [BookmarksTable.userId],
    references: [UserTable.id],
  }),
}));

export type BookmarksTableSelect = typeof BookmarksTable.$inferSelect;
export type BookmarksTableInsert = typeof BookmarksTable.$inferInsert;
