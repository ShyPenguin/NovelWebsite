import { db } from "@/infrastructure/db/index.ts";
import {
  DbClientType,
  DbExecTypes,
  DbPoolType,
} from "@/infrastructure/db/type.ts";
import { NotFoundError } from "@/shared/errors/index.ts";
import { requirePermission } from "@/shared/utils/require-permission.ts";
import {
  PermissionMap,
  Resource,
} from "@repo/contracts/auth/permissions/resource";
import { UserSession } from "@repo/contracts/dto/auth";

export const deleteResourceServiceFactory =
  <
    TData extends PermissionMap[Resource]["delete"]["data"],
    TResource extends Resource,
    U extends { id: string },
  >({
    resource,
    getResourceRepo,
    deleteResourceRepo,
  }: {
    resource: TResource;
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

      return result!;
    });

    return result;
  };
