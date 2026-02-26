import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { NovelTable } from "./novels.ts";

export const AuthorTable = pgTable("authors", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }).notNull().unique(),
});

export const authorRelations = relations(AuthorTable, ({ many }) => ({
  novels: many(NovelTable),
}));

export type AuthorTableSelect = typeof AuthorTable.$inferSelect;
export type AuthorTableInsert = typeof AuthorTable.$inferInsert;
