import z from "zod";
import { ChapterSearchQueryContract } from "@repo/contracts/schemas/chapter";
import { pageField, searchFieldExtend } from "../fields";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";

export const CHAPTER_SEARCH_DEFAULT = {
  page: 1,
  sort: "desc",
  search: "",
} as const;

export const ChapterSearchSchema = ChapterSearchQueryContract.pick({
  page: true,
  sort: true,
  search: true,
}).extend({
  page: pageField,
  sort: z.enum(["asc", "desc"]).catch("desc").default("desc"),
  search: searchFieldExtend,
});

export type ChapterSearchType = z.infer<typeof ChapterSearchSchema>;
export type ChapterSearchInput = z.input<typeof ChapterSearchSchema>;

export type NovelChapterSearchType = ChapterSearchType & {
  novelId: NovelDetailDTO["id"];
};
