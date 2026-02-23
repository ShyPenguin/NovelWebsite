import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  primaryKey,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { UserTable } from "./users.ts";
import { ChapterTable } from "./chapters.ts";
import { relations } from "drizzle-orm";

export const CommentTable = pgTable("comments", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => UserTable.id, { onDelete: "set null" }),
  chapterId: uuid()
    .notNull()
    .references(() => ChapterTable.id, { onDelete: "cascade" }),
  parentId: uuid().references((): AnyPgColumn => CommentTable.id, {
    onDelete: "cascade",
  }),
  comment: varchar({ length: 1_000 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const commentRelation = relations(CommentTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [CommentTable.userId],
    references: [UserTable.id],
  }),
  chapter: one(ChapterTable, {
    fields: [CommentTable.chapterId],
    references: [ChapterTable.id],
  }),
  parent: one(CommentTable, {
    fields: [CommentTable.parentId],
    references: [CommentTable.id],
  }),
  children: many(CommentTable, {
    relationName: "children",
  }),
}));
