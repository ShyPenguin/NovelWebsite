import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { CategoryTable } from "./categories.ts";
import { NovelTable } from "./novels.ts";
import { relations } from "drizzle-orm";

export const NovelCategoryTable = pgTable(
  "novelCategories",
  {
    novelId: uuid()
      .references(() => NovelTable.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: uuid()
      .references(() => CategoryTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => {
    return {
      id: primaryKey({ columns: [table.novelId, table.categoryId] }),
      idx_novel_id: index("idx_novel_category_novel_id").on(table.novelId),
      idx_category_id: index("idx_novel_category_category_id").on(
        table.categoryId,
      ),
    };
  },
);

export const novelCategoryRelation = relations(
  NovelCategoryTable,
  ({ one }) => ({
    novels: one(NovelTable, {
      fields: [NovelCategoryTable.novelId],
      references: [NovelTable.id],
    }),
    categories: one(CategoryTable, {
      fields: [NovelCategoryTable.categoryId],
      references: [CategoryTable.id],
    }),
  }),
);
