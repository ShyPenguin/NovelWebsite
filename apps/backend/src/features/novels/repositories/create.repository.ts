import { NovelTable } from "@/infrastructure/db/schemas/novels.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";

export const createNovelTx = CreateResourceFactory({ table: NovelTable });
