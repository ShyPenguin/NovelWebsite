import { searchFieldExtend, pageField, imageFileField } from "@/shared/schema";
import { NovelQueryContract } from "@repo/contracts/schemas/novel";
import z from "zod";

export const NOVEL_SEARCH_DEFAULT = {
  sort: "desc(createdAt)",
  search: "",
  status: "ALL",
  page: 1,
} as const satisfies NovelSearchPaginatedInput;

const NovelSearchBaseSchema = NovelQueryContract.pick({
  sort: true,
  search: true,
  status: true,
}).extend({
  sort: NovelQueryContract.shape.sort
    .catch("desc(createdAt)")
    .default("desc(createdAt)"),
  search: searchFieldExtend,
  status: NovelQueryContract.shape.status.catch("ALL").default("ALL"),
});
export const NovelSearchPaginatedSchema = NovelSearchBaseSchema.extend({
  page: pageField,
});

export const NovelSearchSchema = NovelSearchBaseSchema;

export type NovelSearchInput = z.input<typeof NovelSearchSchema>;
export type NovelSearchType = z.output<typeof NovelSearchSchema>;
export type NovelSearchPaginatedInput = z.input<
  typeof NovelSearchPaginatedSchema
>;
export type NovelSearchPaginated = z.output<typeof NovelSearchPaginatedSchema>;

export const NovelCoverImageFormSchema = z.object({
  coverImage: imageFileField,
});
