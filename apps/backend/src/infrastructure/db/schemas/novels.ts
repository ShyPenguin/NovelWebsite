import { getTableColumns, relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  numeric,
  index,
  text,
} from "drizzle-orm/pg-core";
import { AuthorTable } from "./authors.js";
import { UserTable } from "./users.js";
import { ReviewTable } from "./reviews.js";
import { ChapterTable } from "./chapters.js";
import { NovelCategoryTable } from "./novelCategories.js";
import { NovelScheduleTable } from "./novelSchedule.js";
import {
  language,
  novelStatus,
  novelTypes,
} from "@repo/contracts/fields/novel";

export const novelTypeEnum = pgEnum("novel_types", novelTypes);

export const languageEnum = pgEnum("language", language);

export const novelStatusEnum = pgEnum("novelStatus", novelStatus);

export const NovelTable = pgTable(
  "novels",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: varchar({ length: 255 }).notNull().unique(),
    authorId: uuid().references(() => AuthorTable.id, { onDelete: "set null" }),
    translatorId: uuid().references(() => UserTable.id, {
      onDelete: "set null",
    }),
    status: novelStatusEnum("status").notNull().default("ONGOING"),
    release: timestamp({ withTimezone: true }).notNull().defaultNow(),
    type: novelTypeEnum().notNull().default("translated"),
    language: languageEnum().notNull().default("korean"),
    description: varchar("description", { length: 1000 }).notNull(),
    rating: numeric("rating", { precision: 2, scale: 1 })
      .notNull()
      .default("5.0"),
    coverImageUrl: text("cover_image_url"),
    coverImagePath: text("cover_image_path"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    idx_novel_author_id: index("idx_novel_author_id").on(table.authorId),
    idx_novel_translator_id: index("idx_novel_translator_id").on(
      table.translatorId,
    ),
  }),
);

export const novelRelation = relations(NovelTable, ({ one, many }) => ({
  reviews: many(ReviewTable),
  author: one(AuthorTable, {
    fields: [NovelTable.authorId],
    references: [AuthorTable.id],
  }),
  translator: one(UserTable, {
    fields: [NovelTable.translatorId],
    references: [UserTable.id],
  }),
  chapters: many(ChapterTable),
  novelCategories: many(NovelCategoryTable),
  novelSchedules: many(NovelScheduleTable),
}));

export const getNovelColumns = () => getTableColumns(NovelTable);

export type NovelTableSelect = typeof NovelTable.$inferSelect;
export type NovelTableInsert = typeof NovelTable.$inferInsert;
