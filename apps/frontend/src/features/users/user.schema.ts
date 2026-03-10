import { searchFieldExtend, pageField } from "@/shared/schema";
import { UserQueryContract } from "@repo/contracts/schemas/user";
import z from "zod";

export const USER_SEARCH_DEFAULT = {
  sort: "desc(createdAt)",
  search: "",
  role: "all",
  page: 1,
} as const satisfies UserSearchInputPaginated;

const UserSearchBaseSchema = UserQueryContract.pick({
  sort: true,
  search: true,
  role: true,
}).extend({
  sort: UserQueryContract.shape.sort
    .catch("desc(createdAt)")
    .default("desc(createdAt)"),
  search: searchFieldExtend,
  role: UserQueryContract.shape.role.catch("all").default("all"),
});
export const UserSearchPaginatedSchema = UserSearchBaseSchema.extend({
  page: pageField,
});

export const UserSearchSchema = UserSearchBaseSchema;

export type UserSearchInput = z.input<typeof UserSearchSchema>;
export type UserSearchType = z.output<typeof UserSearchSchema>;

// Paginated
export type UserSearchInputPaginated = z.input<
  typeof UserSearchPaginatedSchema
>;
export type UserSearchPaginated = z.output<typeof UserSearchPaginatedSchema>;
