import { ChapterTable } from "@/infrastructure/db/schemas/chapters.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";

export const createChapterTx = CreateResourceFactory({ table: ChapterTable });
