import { db } from "@/infrastructure/db/index.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { NotFoundError } from "@/shared/errors/index.js";
import { requirePermission } from "@/shared/utils/require-permission.js";

import type { UserSession } from "@repo/contracts/dto/auth";
import type { NovelAuthDTO } from "@repo/contracts/dto/novel";
import type { ChapterAuthDTO } from "@repo/contracts/dto/chapter";
import type { BookmarkAuthDTO } from "@repo/contracts/dto/bookmark";
import type { UserThumbnailDTO } from "@repo/contracts/dto/user";
import type { AuthorThumbnailDTO } from "@repo/contracts/dto/author";

import type {
  PermissionMap,
  Resource,
} from "@repo/contracts/auth/permissions/resource";
import { AnnouncementAuthDTO } from "@repo/contracts/dto/announcement";

type ResourceAuthDataMap = {
  novels: NovelAuthDTO;
  chapters: ChapterAuthDTO;
  authors: { id: AuthorThumbnailDTO["id"] };
  images: NovelAuthDTO;
  bookmarks: BookmarkAuthDTO;
  users: UserThumbnailDTO;
  announcements: AnnouncementAuthDTO;
};

type DeleteData<R extends Resource> = ResourceAuthDataMap[R];

export const deleteResourceServiceFactory =
  <TResource extends Resource, TResult, TGetParams>({
    resource,
    getResourceRepo,
    deleteResourceRepo,
  }: {
    resource: TResource;

    getResourceRepo: (
      params: TGetParams,
      tx: DbExecTypes,
    ) => Promise<DeleteData<TResource> | null>;

    deleteResourceRepo: ({
      tx,
      resource,
    }: {
      tx: DbExecTypes;
      resource: DeleteData<TResource>;
    }) => Promise<TResult | null>;
  }) =>
  async (
    params: TGetParams,
    user: UserSession,
    tx: DbExecTypes = db,
  ): Promise<TResult> => {
    return tx.transaction(async (trx) => {
      const resourceDetailed = await getResourceRepo(params, trx);

      if (!resourceDetailed) {
        throw new NotFoundError(resource);
      }

      requirePermission<TResource, "delete">({
        user,
        resource,
        action: "delete",

        // TS still struggles with correlated unions here.
        // This cast is much narrower than `as any`.
        ctx: {
          data: resourceDetailed,
        } as PermissionMap[TResource]["delete"],
      });

      const deleted = await deleteResourceRepo({
        tx: trx,
        resource: resourceDetailed,
      });

      return deleted!;
    });
  };
