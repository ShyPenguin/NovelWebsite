import { NovelDetailEncodeDTO, NovelFormDTO } from "@repo/contracts/dto/novel";
import { DbClientType, DbPoolType } from "@/infrastructure/db/type.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { requirePermission } from "@/shared/utils/require-permission.js";
import { db } from "@/infrastructure/db/index.js";
import { upsertNovelCategoriesTx } from "@/features/categories/repository/upsert-novel-categories.js";
import { upsertNovelScheduleTx } from "@/features/novels/services/upsert-novel-schedule.service.js";
import { ValidationError, BaseError } from "@/shared/errors/index.js";
import { createNovelTx } from "../repositories/create.repository.js";
import { getNovelDetailByIdTx } from "../repositories/get-novel-one.js";
import { getCategoriesByIdsTx } from "@/features/categories/repository/get.js";

export const createNovelService = async ({
  form,
  user,
  tx = db,
}: {
  form: NovelFormDTO;
  user: UserSession;
  tx?: DbPoolType | DbClientType;
}): Promise<NovelDetailEncodeDTO> => {
  requirePermission({
    user,
    resource: "novels",
    action: "create",
    ctx: {},
  });
  try {
    const result = await tx.transaction(async (trx) => {
      const { categories, schedule, release, ...inputNovel } = form;
      const novel = await createNovelTx({
        tx: trx,
        form: {
          ...inputNovel,
          release: release ? new Date(release) : new Date(),
          translatorId: user.id,
        },
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
      const novelDetailed = getNovelDetailByIdTx({ id: novel.id }, trx);
      return novelDetailed;
    });

    return result!; // Return the newly created user
  } catch (err: any) {
    if (err.code === "23505" && err.detail?.includes("title")) {
      throw new ValidationError("Title is already taken");
    }

    if (err.code === "23503" && err.detail?.includes("categoryId")) {
      // Just in case it somehow inserts category IDs in upsertNovelCategories which it shouldnt
      throw new ValidationError("One or more category IDs are invalid");
    }

    if (err.message == "One or more category IDs are invalid") {
      throw new ValidationError("One or more category IDs are invalid");
    }
    throw new BaseError(500, "Internal Server Error");
  }
};
