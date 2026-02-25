import {
  ChapterDetailEncodeDTO,
  ChapterFormParsedDTO,
} from "@repo/contracts/dto/chapter";
import { previewChapterService } from "./previewChapterService.ts";
import { db } from "@/db/index.ts";
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
import { updateChapterTx } from "@/repositories/chapters/update.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { requirePermission } from "@/utils/requirePermission.ts";

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
        throw new NotFoundError("chapters");
      }
      requirePermission({
        user,
        resource: "chapters",
        action: "update",
        data: chapter,
      });
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
      throw new NotFoundError("novels");
    }
    if (err.constructor.name == "NotFoundError")
      throw new NotFoundError("chapters");

    if (err.constructor.name == "AuthorizationError")
      throw new AuthorizationError({ action: "update", resource: "chapters" });

    if (err.code === "23505" && err.constraint === "idx_unique_novel_chapter") {
      throw new ValidationError("Chapter's number is already taken");
    }
    throw new BaseError(500, "Internal Server Error");
  }
};
