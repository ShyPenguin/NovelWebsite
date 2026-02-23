import { NovelQueryContract } from "@repo/contracts/schemas/novel";
import { z } from "zod";
import { pageField } from "./fieldsNew.ts";
import { NumberSchemaBuilder } from "@repo/contracts/fields/builders";
import { searchField } from "@repo/contracts/fields/general";

export const createNovelScheduleSchema = z.object({
  novelId: z.string().uuid(),
  days: z
    .array(z.enum(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]))
    .max(7),
});

export type novelSchedule = {
  novelId: string;
  day: "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
}[];

// export const NovelQueryContract = z.object({
// sort: novelSortWithDirectionField
//   .optional()
//   .catch("desc(title)")
//   .default("desc(title)"),
//   status: novelStatusQueryField.optional().catch("ALL").default("ALL"),
//   title: z.string().optional().catch("").default(""),
//   page: z.coerce.number().optional(),
//   pageSize: z.coerce.number().optional(),
// });
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
