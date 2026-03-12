import { db } from "@/infrastructure/db/index.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { NotFoundError } from "@/shared/errors/index.ts";
import { Resource } from "@repo/contracts/auth/permissions/resource";

export const getResourceServiceFactory =
  <Params, T>({
    resource,
    repository,
  }: {
    resource: Resource;
    repository: (params: Params, tx: DbExecTypes) => Promise<T | null>;
  }) =>
  async (args: Params): Promise<T> => {
    const data = await repository(args, db);

    if (!data) {
      throw new NotFoundError(resource);
    }

    return data;
  };
