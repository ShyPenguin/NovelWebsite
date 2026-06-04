import { db } from "@/infrastructure/db/index.js";
import {
  DbClientType,
  DbExecTypes,
  DbPoolType,
} from "@/infrastructure/db/type.js";
import { NotFoundError } from "@/shared/errors/index.js";
import { requirePermission } from "@/shared/utils/require-permission.js";
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
    GetParams,
  >({
    resource,
    getResourceRepo,
    deleteResourceRepo,
  }: {
    resource: TResource;
    getResourceRepo: (
      getParams: GetParams,
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
  async (
    getParams: GetParams,
    user: UserSession,
    tx: DbExecTypes = db,
  ): Promise<U> => {
    const result = await tx.transaction(async (trx) => {
      const resourceDetailed = await getResourceRepo(getParams, trx);

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
