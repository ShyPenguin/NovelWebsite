import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { NovelCategoryTable } from "./novelCategories.js";

export const CategoryTable = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const categoryRelation = relations(CategoryTable, ({ many }) => ({
  novelCategory: many(NovelCategoryTable),
}));

export type CategoryInsert = typeof CategoryTable.$inferInsert;
export type CategorySelect = typeof CategoryTable.$inferSelect;
