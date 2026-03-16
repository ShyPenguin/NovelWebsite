import { getTableColumns, relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";
import { UserOAuthAccountTable } from "./oauthProviders.js";
import { NovelTable } from "./novels.js";
import { ReviewTable } from "./reviews.js";
import { CommentTable } from "./comments.js";
import { userRoles } from "@repo/contracts/fields/users";

export const userRoleEnum = pgEnum("user_roles", userRoles);

export const UserTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  name: varchar("name", { length: 30 }).notNull(),
  email: text().notNull().unique(),
  role: userRoleEnum().notNull().default("user"),
  imageUrl: text("image_url"),
  imagePath: text("image_path"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(UserTable, ({ many, one }) => ({
  oAuthAccounts: many(UserOAuthAccountTable),
  novels: many(NovelTable),
  reviews: many(ReviewTable),
  comments: many(CommentTable),
}));

export const getUserColumns = () => getTableColumns(UserTable);
export type UserTableSelect = typeof UserTable.$inferSelect;
export type UserTableInsert = typeof UserTable.$inferInsert;
