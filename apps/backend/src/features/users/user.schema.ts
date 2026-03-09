import { z } from "zod";
import { pageField } from "@/shared/validations/fields.ts";
import { NumberSchemaBuilder } from "@repo/contracts/fields/builders";
import { searchField } from "@repo/contracts/fields/general";
import { UserQueryContract } from "@repo/contracts/schemas/user";

export const UserQuerySchema = UserQueryContract.pick({
  sort: true,
  role: true,
  search: true,
  page: true,
  pageSize: true,
}).extend({
  sort: UserQueryContract.shape["sort"].default("desc(name)"),
  role: UserQueryContract.shape["role"].default("all"),
  search: searchField.optional(),
  page: pageField.optional(),
  pageSize: new NumberSchemaBuilder("Page's size")
    .min(1)
    .max(100)
    .build()
    .optional(),
});

export type UserQueryInput = z.input<typeof UserQuerySchema>;
export type UserQueryOutput = z.output<typeof UserQuerySchema>;
