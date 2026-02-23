import {
  ChapterDetailEncodeDTO,
  ChapterFormParsedDTO,
} from "@repo/contracts/dto/chapter";
import { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { previewChapterService } from "./previewChapterService.ts";
import { ChapterTable } from "@/db/schemas/chapters.ts";
import { db } from "@/db/index.ts";
import { createChapterTx } from "@/repositories/chapters/create.ts";
import { getChapterDetailByIdTx } from "@/repositories/chapters/getChapterById.ts";
import { BaseError, NotFoundError, ValidationError } from "@/utils/error.ts";
import { DbClientType, DbPoolType } from "@/db/type.ts";

export const createChapterService = async ({
  form,
  novelId,
  tx = db,
}: {
  form: ChapterFormParsedDTO;
  novelId: NovelDetailDTO["id"];
  tx?: DbPoolType | DbClientType;
}): Promise<ChapterDetailEncodeDTO> => {
  const { sourceDocUrl, chapterNumber } = form;

  const { title, contentHtml } = await previewChapterService(sourceDocUrl);

  const chapterData: typeof ChapterTable.$inferInsert = {
    ...form,
    title: title,
    chapterNumber: Number(chapterNumber),
    sourceDocUrl: sourceDocUrl,
    novelId: novelId,
    contentHtml: contentHtml,
  };

  try {
    const result = await tx.transaction(async (trx) => {
      const chapter = await createChapterTx({ tx: trx, form: chapterData });

      const chapterDetailed = await getChapterDetailByIdTx({
        tx: trx,
        id: chapter.id,
      });

      return chapterDetailed;
    });
    return result!;
  } catch (err: any) {
    if (err.code === "23503") {
      throw new NotFoundError("novel");
    }

    if (err.code === "23505" && err.constraint === "idx_unique_novel_chapter") {
      throw new ValidationError("Chapter's number is already taken");
    }
    throw new BaseError(500, "Internal Server Error");
  }
};
