import { NovelTable } from "@/infrastructure/db/schemas/novels.ts";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.ts";

export const createNovelTx = CreateResourceFactory({ table: NovelTable });
