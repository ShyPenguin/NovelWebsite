import {
  AnnouncementDetailEncodeDTO,
  AnnouncementAuthDTO,
  AnnouncementSelectDTO,
  AnnouncementThumbnailDTO,
} from "@repo/contracts/dto/announcement";
import {
  AnnouncementDetailSchema,
  AnnouncementAuthSchema,
  AnnouncementThumbnailSchema,
} from "@repo/contracts/schemas/announcement";
import { ZodType } from "zod";
import { buildAnnouncementsBaseQuery } from "./announcement.build-base-query.js";
import { GetFetchReturn } from "@/shared/types/service.types.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import {
  announcementWhereMap,
  type AnnouncementWhere,
} from "./announcement.where.js";
import { SQL } from "drizzle-orm";

type AnnouncementDTOMap = {
  thumbnail: AnnouncementThumbnailDTO;
  detail: AnnouncementDetailEncodeDTO;
  auth: AnnouncementAuthDTO;
};

export const getAnnouncementFactory = <
  T extends AnnouncementSelectDTO,
  W extends keyof AnnouncementWhere,
>({
  type,
  schema,
  where,
}: {
  type: T;
  schema: ZodType;
  where: W;
}) => {
  return async (
    params: Parameters<AnnouncementWhere[W]>[0],
    tx: DbExecTypes,
  ): Promise<GetFetchReturn<AnnouncementDTOMap, T> | null> => {
    const baseQuery = buildAnnouncementsBaseQuery({
      type,
      tx,
    });

    const fn = announcementWhereMap[where] as (
      arg: Parameters<AnnouncementWhere[W]>[0],
    ) => SQL<unknown> | undefined;

    const result = await baseQuery.where(fn(params));
    if (!result[0]) return null;
    return schema.encode(result[0]) as GetFetchReturn<AnnouncementDTOMap, T>;
  };
};

export const getAnnouncementDetailByIdTx = getAnnouncementFactory({
  type: "detail",
  schema: AnnouncementDetailSchema,
  where: "id",
});

export const getAnnouncementAuthByIdTx = getAnnouncementFactory({
  type: "auth",
  schema: AnnouncementAuthSchema,
  where: "id",
});

export const getAnnouncementThumbnailByIdTx = getAnnouncementFactory({
  type: "thumbnail",
  schema: AnnouncementThumbnailSchema,
  where: "id",
});
