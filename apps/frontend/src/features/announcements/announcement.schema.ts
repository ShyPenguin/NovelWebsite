import { AnnouncementQueryContract } from "@repo/contracts/schemas/announcement";
import type z from "zod";
import {
  pageField,
  pageSizeField,
  searchFieldExtend,
} from "../../shared/schema";
import { DEFAULT_PAGE_SIZE } from "@repo/contracts/constants";

export const ANNOUNCEMENT_SEARCH_DEFAULT = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: "",
};
export const AnnouncementSearchSchema = AnnouncementQueryContract.pick({
  page: true,
  pageSize: true,
  search: true,
}).extend({
  page: pageField,
  pageSize: pageSizeField,
  search: searchFieldExtend,
});

export type AnnouncementSearchType = z.infer<typeof AnnouncementSearchSchema>;
export type AnnouncementSearchInput = z.input<typeof AnnouncementSearchSchema>;
