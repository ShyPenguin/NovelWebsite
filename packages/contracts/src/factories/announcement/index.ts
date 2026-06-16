import { AnnouncementBaseSchema } from "@/base/announcement.base.js";
import { TranslatorSchema } from "../translator/index.js";
import { GetFactory } from "../read-factory.js";
import { UserBaseSchema } from "@/base/user.base.js";
import { z } from "zod";
import { createSortWithDirectionField } from "@/utils/createSortWithDirection.js";

const AnnouncementAuthSchema = AnnouncementBaseSchema.pick({
  id: true,
}).extend({
  author: TranslatorSchema.nullish(),
});

const AnnoucementThumbnailSchema = AnnouncementBaseSchema.pick({
  id: true,
  title: true,
  updatedAt: true,
  createdAt: true,
});

const AnnouncementDetailSchema = AnnouncementBaseSchema.pick({
  id: true,
  title: true,
  content: true,
  updatedAt: true,
  createdAt: true,
}).extend({
  author: UserBaseSchema.pick({
    id: true,
    name: true,
    username: true,
    role: true,
  }),
});

export const announcementSort = [
  "createdAt",
  "updatedAt",
  "title",
] as const satisfies ReadonlyArray<
  keyof z.infer<typeof AnnouncementDetailSchema>
>;

export const announcementSortField = z.enum(announcementSort, {
  message: "Sort must be createdAt, updatedAt or title",
});

export const announcementSortWithDirectionField =
  createSortWithDirectionField(announcementSort);

export const AnnouncementThumbnailFactory = new GetFactory({
  schema: AnnoucementThumbnailSchema,
});

export const AnnouncementAuthFactory = new GetFactory({
  schema: AnnouncementAuthSchema,
});

export const AnnouncementDetailFactory = new GetFactory({
  schema: AnnouncementDetailSchema,
});
