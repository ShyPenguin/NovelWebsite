import { db } from "@/infrastructure/db/index.js";
import {
  DbClientType,
  DbExecTypes,
  DbPoolType,
} from "@/infrastructure/db/type.js";
import { NotFoundError } from "@/shared/errors/index.js";
import { requirePermission } from "@/shared/utils/require-permission.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { deleteImageFromStore } from "@/infrastructure/storage/repository/storageDelete.js";
import {
  PermissionMap,
  Resource,
} from "@repo/contracts/auth/permissions/resource";

type KeysWithStringValues<T> = {
  [K in keyof T]: T[K] extends string | undefined | null ? K : never;
}[keyof T];

export const deleteResourceWithAssetsServiceFactory =
  <
    TData extends PermissionMap[Resource]["delete"]["data"],
    TResource extends Resource,
    U extends { id: string },
  >({
    resource,
    resourceAsset,
    getResourceRepo,
    deleteResourceRepo,
  }: {
    resource: TResource;
    resourceAsset: KeysWithStringValues<U>;
    getResourceRepo: (
      {
        id,
      }: {
        id: string;
      },
      tx: DbExecTypes,
    ) => Promise<TData | null>;
    deleteResourceRepo: ({
      tx,
      id,
    }: {
      tx: DbExecTypes;
      id: string;
    }) => Promise<U | null>;
  }) =>
  async ({
    tx = db,
    id,
    user,
  }: {
    tx?: DbClientType | DbPoolType;
    id: string;
    user: UserSession;
  }): Promise<U> => {
    const result = await tx.transaction(async (trx) => {
      const resourceDetailed = await getResourceRepo({ id }, trx);

      if (!resourceDetailed) {
        throw new NotFoundError(resource);
      }

      requirePermission({
        user,
        resource,
        action: "delete",
        ctx: {
          data: resourceDetailed,
        },
      });

      const result = await deleteResourceRepo({
        tx: trx,
        id: resourceDetailed.id,
      });

      if (process.env.NODE_ENV !== "test" && result![resourceAsset]) {
        await deleteImageFromStore(result![resourceAsset] as string);
      }

      return result!;
    });

    return result;
  };
