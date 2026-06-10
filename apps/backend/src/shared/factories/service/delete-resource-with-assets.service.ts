import { db } from "@/infrastructure/db/index.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { NotFoundError } from "@/shared/errors/index.js";
import { requirePermission } from "@/shared/utils/require-permission.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { deleteImageFromStore } from "@/infrastructure/storage/repository/storageDelete.js";
import {
  PermissionMap,
  Resource,
} from "@repo/contracts/auth/permissions/resource";
import { NovelAuthDTO } from "@repo/contracts/dto/novel";
import { UserThumbnailEncodeDTO } from "@repo/contracts/dto/user";

type KeysWithStringValues<T> = {
  [K in keyof T]: T[K] extends string | undefined | null ? K : never;
}[keyof T];

type ResourceAuthDataMap = {
  novels: NovelAuthDTO;
  users: UserThumbnailEncodeDTO;
};

type ResourceWithAssets = Extract<Resource, "novels" | "users">;
type DeleteData<R extends ResourceWithAssets> = ResourceAuthDataMap[R];

export const deleteResourceWithAssetsServiceFactory =
  <TResource extends ResourceWithAssets, TResult, TGetParams>({
    resource,
    resourceAsset,
    getResourceRepo,
    deleteResourceRepo,
  }: {
    resource: TResource;
    resourceAsset: KeysWithStringValues<TResult>;
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

      if (process.env.NODE_ENV !== "test" && deleted![resourceAsset]) {
        await deleteImageFromStore(deleted![resourceAsset] as string);
      }

      return deleted!;
    });
  };
