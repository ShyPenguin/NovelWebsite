import {
  ChapterDetailEncodeDTO,
  ChapterFormParsedDTO,
} from "@repo/contracts/dto/chapter";
import { previewChapterService } from "./preview-chapter.service.js";
import { db } from "@/infrastructure/db/index.js";
import {
  AuthorizationError,
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors/index.js";
import { DbClientType, DbPoolType } from "@/infrastructure/db/type.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { requirePermission } from "@/shared/utils/require-permission.js";
import {
  getChapterAuthByIdTx,
  getChapterDetailByIdTx,
} from "../repositories/get-chapter-one.repository.js";
import { updateChapterTx } from "../repositories/update.repository.js";

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
      const chapter = await getChapterAuthByIdTx(
        {
          id,
        },
        trx,
      );

      if (!chapter) {
        throw new NotFoundError("chapters");
      }
      requirePermission({
        user,
        resource: "chapters",
        action: "update",
        ctx: {
          data: chapter,
        },
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
      const chapterDetailed = await getChapterDetailByIdTx(
        {
          id: updateChapter.id,
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
