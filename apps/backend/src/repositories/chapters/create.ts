import { ChapterTable } from "../../db/schemas/index.ts";
import { CreateResourceFactory } from "../factories/create.ts";

export const createChapterTx = CreateResourceFactory({ table: ChapterTable });
