import { db, Resource } from "@/db/index.ts";
import { DbClientType, DbExecTypes, DbPoolType } from "@/db/type.ts";
import { UserSession } from "@/types/index.ts";
import { AuthorizationError, NotFoundError } from "@/utils/error.ts";
import { UserRole } from "@repo/contracts/dto/auth";

export const deleteResourceServiceFactory =
  <T extends { id: string }, U extends { id: string }>({
    resource,
    getOwner,
    getResourceRepo,
    deleteResourceRepo,
    allowedRolesToSkip,
    getOwner2,
  }: {
    resource: Resource;
    getOwner: (resource: T) => string | null | undefined;
    allowedRolesToSkip: UserRole[];
    getOwner2?: (resource: T) => string | null | undefined;
    getResourceRepo: ({
      tx,
      id,
    }: {
      tx: DbExecTypes;
      id: string;
    }) => Promise<T | null>;
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
      if (
        !allowedRolesToSkip.includes(user.role) &&
        user.id !== getOwner(resourceDetailed) &&
        (getOwner2 ? user.id !== getOwner2(resourceDetailed) : true)
      ) {
        throw new AuthorizationError({ action: "delete", resource: resource });
      }
      const result = await deleteResourceRepo({
        tx: trx,
        id: resourceDetailed.id,
      });

      return result!;
    });

    return result;
  };
