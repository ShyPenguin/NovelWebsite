import {
  NovelDetailDTO,
  NovelDetailEncodeDTO,
  NovelFormDTO,
} from "@repo/contracts/dto/novel";
import { DbClientType, DbPoolType } from "@/infrastructure/db/type.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { requirePermission } from "@/shared/utils/require-permission.ts";
import { db } from "@/infrastructure/db/index.ts";
import { upsertNovelCategoriesTx } from "@/features/categories/repository/upsert-novel-categories.ts";
import { upsertNovelScheduleTx } from "@/features/novels/services/upsert-novel-schedule.service.ts";
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  BaseError,
} from "@/shared/errors/index.ts";
import {
  getNovelAuthByIdTx,
  getNovelDetailByIdTx,
} from "../repositories/get-novel-by-id.repository.ts";
import { updateNovelTx } from "../repositories/update.repository.ts";
import { getCategoriesByIdsTx } from "@/features/categories/repository/get.ts";

export const updateNovelService = async ({
  form,
  id,
  user,
  tx = db,
}: {
  form: NovelFormDTO;
  user: UserSession;
  id: NovelDetailDTO["id"];
  tx?: DbPoolType | DbClientType;
}): Promise<NovelDetailEncodeDTO> => {
  try {
    const result = await tx.transaction(async (trx) => {
      const { categories, schedule, release, ...inputNovel } = form;

      const novel = await getNovelAuthByIdTx({ tx, id });

      if (!novel) throw new NotFoundError("novels");

      requirePermission({
        user,
        resource: "novels",
        action: "update",
        ctx: {
          data: novel,
        },
      });
      await updateNovelTx({
        tx: trx,
        form: {
          ...inputNovel,
          release: release ? new Date(release) : new Date(),
        },
        id,
      });
      const getCategories =
        categories.length > 0
          ? await getCategoriesByIdsTx(trx, categories)
          : [];

      if (categories.length !== getCategories.length) {
        throw new ValidationError("One or more category IDs are invalid");
      }

      await upsertNovelCategoriesTx(
        trx,
        novel.id,
        getCategories.map((c) => c.id),
      );

      await upsertNovelScheduleTx(trx, novel.id, schedule ? schedule : []);
      const novelDetailed = getNovelDetailByIdTx({ tx: trx, id: novel.id });
      return novelDetailed;
    });

    if (!result) throw new NotFoundError("novels");

    return result;
  } catch (err: any) {
    if (err.code === "23505" && err.detail?.includes("title")) {
      throw new ValidationError("Title is already taken");
    }

    if (err.code === "23503" && err.detail?.includes("categoryId")) {
      // Just in case it somehow inserts category IDs in upsertNovelCategories which it shouldnt
      throw new ValidationError("One or more category IDs are invalid");
    }

    if (err.message == "One or more category IDs are invalid")
      throw new ValidationError("One or more category IDs are invalid");

    if (err.constructor.name == "NotFoundError")
      throw new NotFoundError("novels");

    if (err.constructor.name == "AuthorizationError")
      throw new AuthorizationError({ action: "update", resource: "novels" });

    throw new BaseError(500, "Internal Server Error");
  }
};
