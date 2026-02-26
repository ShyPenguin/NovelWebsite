import { NovelQueryContract } from "@repo/contracts/schemas/novel";
import { z } from "zod";
import { NumberSchemaBuilder } from "@repo/contracts/fields/builders";
import { searchField } from "@repo/contracts/fields/general";
import { pageField } from "@/shared/validations/fields.ts";

export type novelSchedule = {
  novelId: string;
  day: "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
}[];

export const NovelQuerySchema = NovelQueryContract.pick({
  sort: true,
  status: true,
  search: true,
  page: true,
  pageSize: true,
}).extend({
  sort: NovelQueryContract.shape["sort"].default("desc(title)"),
  status: NovelQueryContract.shape["status"].default("ALL"),
  search: searchField.optional(),
  page: pageField.optional(),
  pageSize: new NumberSchemaBuilder("Page's size")
    .min(1)
    .max(100)
    .build()
    .optional(),
});

// For input (where status can be undefined)
export type NovelQueryInput = z.input<typeof NovelQuerySchema>;
// For output (where status will always have a value)
export type NovelQueryOutput = z.output<typeof NovelQuerySchema>;
