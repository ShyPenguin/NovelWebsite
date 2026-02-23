import {
  ChapterDetailEncodeDTO,
  ChapterFormParsedDTO,
} from "@repo/contracts/dto/chapter";
import { previewChapterService } from "./previewChapterService.ts";
import { ChapterTable } from "@/db/schemas/chapters.ts";
import { db } from "@/db/index.ts";
import { createChapterTx } from "@/repositories/chapters/create.ts";
import {
  getChapterDetailByIdTx,
  getChapterPosterByIdTx,
} from "@/repositories/chapters/getChapterById.ts";
import {
  AuthorizationError,
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/utils/error.ts";
import { DbClientType, DbPoolType } from "@/db/type.ts";
import { UserSession } from "@/types/index.ts";
import { updateChapterTx } from "@/repositories/chapters/update.ts";

export const updateChapterService = async ({
  form,
  id,
  user,
  tx = db,
}: {
  form: ChapterFormParsedDTO;
  id: ChapterDetailEncodeDTO["id"];
  user: UserSession;
  tx?: DbPoolType | DbClientType;
}): Promise<ChapterDetailEncodeDTO> => {
  const { sourceDocUrl, chapterNumber } = form;

  const { title, contentHtml } = await previewChapterService(sourceDocUrl);

  try {
    const result = await tx.transaction(async (trx) => {
      const chapter = await getChapterPosterByIdTx({
        tx: trx,
        id,
      });

      if (!chapter) {
        throw new NotFoundError("chapter");
      }

      if (user.role !== "admin" && user.id !== chapter.translator?.id) {
        throw new AuthorizationError({ action: "update", resource: "chapter" });
      }

      const updateChapter = await updateChapterTx({
        tx: trx,
        id,
        form: {
          ...form,
          chapterNumber: Number(chapterNumber),
          title,
          contentHtml,
        },
      });
      const chapterDetailed = await getChapterDetailByIdTx({
        tx: trx,
        id: updateChapter.id,
      });

      return chapterDetailed;
    });
    return result!;
  } catch (err: any) {
    if (err.code === "23503") {
      throw new NotFoundError("novel");
    }
    if (err.constructor.name == "NotFoundError")
      throw new NotFoundError("chapter");

    if (err.constructor.name == "AuthorizationError")
      throw new AuthorizationError({ action: "update", resource: "chapter" });

    if (err.code === "23505" && err.constraint === "idx_unique_novel_chapter") {
      throw new ValidationError("Chapter's number is already taken");
    }
    throw new BaseError(500, "Internal Server Error");
  }
};
