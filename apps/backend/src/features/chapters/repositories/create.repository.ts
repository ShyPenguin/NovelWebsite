import { ChapterTable } from "@/infrastructure/db/schemas/chapters.ts";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.ts";

export const createChapterTx = CreateResourceFactory({ table: ChapterTable });
