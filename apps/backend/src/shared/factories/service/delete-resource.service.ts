import { db, Resource } from "@/infrastructure/db/index.ts";
import {
  DbClientType,
  DbExecTypes,
  DbPoolType,
} from "@/infrastructure/db/type.ts";
import { NotFoundError } from "@/shared/errors/index.ts";
import { requirePermission } from "@/shared/utils/require-permission.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { Permissions } from "@repo/contracts/auth-abac";

export const deleteResourceServiceFactory =
  <
    TData extends Permissions[Resource]["dataType"],
    TResource extends Resource,
    U extends { id: string },
  >({
    resource,
    getResourceRepo,
    deleteResourceRepo,
  }: {
    resource: TResource;
    getResourceRepo: ({
      tx,
      id,
    }: {
      tx: DbExecTypes;
      id: string;
    }) => Promise<TData | null>;
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
      const resourceDetailed = await getResourceRepo({ tx: trx, id: id });

      if (!resourceDetailed) {
        throw new NotFoundError(resource);
      }

      requirePermission({
        user,
        resource,
        action: "delete",
        data: resourceDetailed,
      });

      const result = await deleteResourceRepo({
        tx: trx,
        id: resourceDetailed.id,
      });

      return result!;
    });

    return result;
  };
