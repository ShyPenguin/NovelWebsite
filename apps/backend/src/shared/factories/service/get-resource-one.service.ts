import { db } from "@/infrastructure/db/index.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { NotFoundError } from "@/shared/errors/index.js";
import { Resource } from "@repo/contracts/auth/permissions/resource";
import { UserSession } from "@repo/contracts/dto/auth";

export const getResourceServiceFactory =
  <Params, T>({
    resource,
    repository,
  }: {
    resource: Resource;
    repository: (
      params: Params,
      tx: DbExecTypes,
      userId?: UserSession["id"],
    ) => Promise<T | null>;
  }) =>
  async (args: Params, user?: UserSession): Promise<T> => {
    const data = await repository(args, db, user?.id);

    if (!data) {
      throw new NotFoundError(resource);
    }

    return data;
  };
