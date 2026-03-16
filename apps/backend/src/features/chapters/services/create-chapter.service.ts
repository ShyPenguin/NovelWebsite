import {
  ChapterDetailEncodeDTO,
  ChapterFormParsedDTO,
} from "@repo/contracts/dto/chapter";
import { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { previewChapterService } from "./preview-chapter.service.js";
import { ChapterTable } from "@/infrastructure/db/schemas/chapters.js";
import { db } from "@/infrastructure/db/index.js";
import {
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors/index.js";
import { DbClientType, DbPoolType } from "@/infrastructure/db/type.js";
import { requirePermission } from "@/shared/utils/require-permission.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { createChapterTx } from "../repositories/create.repository.js";
import { getChapterDetailByIdTx } from "../repositories/get-chapter-one.repository.js";

export const createChapterService = async ({
  form,
  novelId,
  user,
  tx = db,
}: {
  form: ChapterFormParsedDTO;
  novelId: NovelDetailDTO["id"];
  user: UserSession;
  tx?: DbPoolType | DbClientType;
}): Promise<ChapterDetailEncodeDTO> => {
  requirePermission({
    user,
    resource: "chapters",
    action: "create",
    ctx: {},
  });
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

      const chapterDetailed = await getChapterDetailByIdTx(
        {
          id: chapter.id,
        },
        trx,
      );

      return chapterDetailed;
    });
    return result!;
  } catch (err: any) {
    if (err.code === "23503") {
      throw new NotFoundError("novels");
    }

    if (err.code === "23505" && err.constraint === "idx_unique_novel_chapter") {
      throw new ValidationError("Chapter's number is already taken");
    }
    throw new BaseError(500, "Internal Server Error");
  }
};
