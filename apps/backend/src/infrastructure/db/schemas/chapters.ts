import { desc, getTableColumns, relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  pgEnum,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { NovelTable } from "./novels.js";
import { CommentTable } from "./comments.js";
import {
  chapterAccessTypes,
  chapterStatus,
} from "@repo/contracts/fields/chapters";

export const chapterStatusEnum = pgEnum("chapter_status", chapterStatus);

export const chapterAccessEnum = pgEnum("chapter_access", chapterAccessTypes);

export const ChapterTable = pgTable(
  "chapters",
  {
    id: uuid().primaryKey().defaultRandom(),
    chapterNumber: integer().notNull(),
    novelId: uuid()
      .notNull()
      .references(() => NovelTable.id, { onDelete: "cascade" }),
    title: varchar({ length: 200 }).notNull(),
    sourceDocUrl: text("source_doc_url").notNull(),
    contentHtml: text("content_html").notNull(),
    status: chapterStatusEnum("status").notNull().default("draft"),
    access: chapterAccessEnum("access").notNull().default("free"),
    publishedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    indexChapterNovelId: index("idx_chapter_novel_id").on(t.novelId),
    uniqueNovelChapter: uniqueIndex("idx_unique_novel_chapter").on(
      t.novelId,
      t.chapterNumber,
    ),
    indexNovelChapterDesc: index("idx_chapter_novelid_chapternumber").on(
      t.novelId,
      desc(t.chapterNumber),
    ),
  }),
);

export const chapterRelation = relations(ChapterTable, ({ one, many }) => ({
  novel: one(NovelTable, {
    fields: [ChapterTable.novelId],
    references: [NovelTable.id],
  }),
  comments: many(CommentTable),
}));

export const getChapterColumns = () => getTableColumns(ChapterTable);
export type ChapterTableSelect = typeof ChapterTable.$inferSelect;
export type ChapterTableInsert = typeof ChapterTable.$inferInsert;
