import { NovelTable } from "../../db/schemas/index.ts";
import { CreateResourceFactory } from "../factories/create.ts";

export const createNovelTx = CreateResourceFactory({ table: NovelTable });
