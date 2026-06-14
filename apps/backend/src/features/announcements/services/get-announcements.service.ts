import { db } from "@/infrastructure/db/index.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { AnnouncementQueryOutput } from "@/features/announcements/announcement.schema.js";
import {
  AnnouncementThumbnailDTO,
  AnnouncementListDTO,
  AnnouncementDetailDTO,
} from "@repo/contracts/dto/announcement";
import { ZodType } from "zod";
import {
  ArrayAnnouncementThumbnailSchema,
  PaginatedAnnouncementThumbnailSchema,
} from "@repo/contracts/schemas/announcement";
import {
  GetFetchListReturn,
  GetListParams,
  GetServiceList,
} from "@/shared/types/service.types.js";
import {
  getAnnouncementsTx,
  getPaginatedAnnouncementsTx,
} from "../repositories/get-announcements.repository.js";
import { DEFAULT_PAGE_SIZE } from "@repo/contracts/constants";

type AnnouncementDTOMAP = {
  thumbnail: AnnouncementThumbnailDTO[];
};

type BaseArgs = {
  query?: AnnouncementQueryOutput;
  tx?: DbExecTypes;
};

export const getAnnouncementsServiceFactory = <
  T extends AnnouncementListDTO,
  P extends boolean,
>({
  type,
  paginated,
  schema,
}: {
  type: T;
  paginated: P;
  schema: ZodType;
}) => {
  return async (
    {
      query = {},
      tx = db,
      page,
      pageSize,
    }: GetListParams<BaseArgs, P> = {} as GetListParams<BaseArgs, P>,
  ): Promise<GetFetchListReturn<AnnouncementDTOMAP, T, P>> => {
    if (!paginated) {
      // Return array
      const announcements = await getAnnouncementsTx({ tx, query, type });
      const parsedNovel = schema.encode(announcements);
      return parsedNovel as GetFetchListReturn<AnnouncementDTOMAP, T, P>;
    }
    // Return paginated
    const paginatedData = await getPaginatedAnnouncementsTx({
      tx: tx,
      query: query!,
      type,
      page: page ? page : 1,
      pageSize: pageSize ? pageSize : DEFAULT_PAGE_SIZE,
    });

    const parsedPaginatedData = schema.encode(paginatedData);
    return parsedPaginatedData as GetFetchListReturn<AnnouncementDTOMAP, T, P>;
  };
};

// Thumbnails
export const getAnnouncementsThumbnailService = getAnnouncementsServiceFactory({
  type: "thumbnail",
  paginated: false,
  schema: ArrayAnnouncementThumbnailSchema,
});
export const getAnnouncementsThumbnailPaginatedService =
  getAnnouncementsServiceFactory({
    type: "thumbnail",
    paginated: true,
    schema: PaginatedAnnouncementThumbnailSchema,
  });

export const GetAnnouncementsServices = {
  thumbnail: {
    list: getAnnouncementsThumbnailService,
    paginated: getAnnouncementsThumbnailPaginatedService,
  },
} satisfies GetServiceList<AnnouncementListDTO>;
