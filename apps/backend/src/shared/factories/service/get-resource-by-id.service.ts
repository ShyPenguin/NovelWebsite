import { Resource, db } from "@/infrastructure/db/index.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { NotFoundError } from "@/shared/errors/index.ts";

export const getResourceByIdServiceFactory =
  <T>({
    resource,
    repository,
  }: {
    resource: Resource;
    repository: ({
      tx,
      id,
    }: {
      tx: DbExecTypes;
      id: string;
    }) => Promise<T | null>;
  }) =>
  async ({ tx = db, id }: { id: string; tx?: DbExecTypes }): Promise<T> => {
    const data = await repository({ tx, id });

    if (!data) {
      throw new NotFoundError(resource);
    }

    return data;
  };
