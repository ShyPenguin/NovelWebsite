import { z } from "zod";
import { searchField } from "@repo/contracts/fields/general";
import { pageField } from "@/shared/validations/fields.js";
import { NumberSchemaBuilder } from "@repo/contracts/fields/builders";
import { AnnouncementQueryContract } from "@repo/contracts/schemas/announcement";

export const AnnouncementQuerySchema = AnnouncementQueryContract.pick({
  page: true,
  pageSize: true,
  search: true,
}).extend({
  search: searchField.optional(),
  page: pageField.optional(),
  pageSize: new NumberSchemaBuilder("Page's size")
    .min(1)
    .max(100)
    .build()
    .optional(),
});

export type AnnouncementQueryInput = z.input<typeof AnnouncementQuerySchema>;
export type AnnouncementQueryOutput = z.output<typeof AnnouncementQuerySchema>;
