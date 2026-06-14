import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { UserTable } from "./users.js";

export const AnnouncementTable = pgTable(
  "announcements",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: varchar({ length: 255 }).notNull().unique(),
    authorId: uuid("author_id").references(() => UserTable.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    idx_announcement_author_id: index("idx_announcement_author_id").on(
      table.authorId,
    ),
  }),
);

export type AnnouncementTableSelect = typeof AnnouncementTable.$inferSelect;
export type AnnouncementTableInsert = typeof AnnouncementTable.$inferInsert;
