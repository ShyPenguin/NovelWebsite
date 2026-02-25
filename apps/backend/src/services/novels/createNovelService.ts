import { NovelDetailEncodeDTO, NovelFormDTO } from "@repo/contracts/dto/novel";
import { DbClientType, DbPoolType } from "@/db/type.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { requirePermission } from "@/utils/requirePermission.ts";
import { db } from "@/db/index.ts";
import { getCategoriesByIdsTx } from "@/repositories/categories/get.ts";
import { upsertNovelCategoriesTx } from "@/repositories/novelCategories/upsertNovelCategories.ts";
import { createNovelTx } from "@/repositories/novels/create.ts";
import { getNovelDetailByIdTx } from "@/repositories/novels/getNovelById.ts";
import { upsertNovelScheduleTx } from "@/repositories/novelSchedule/index.ts";
import { ValidationError, BaseError } from "@/utils/error.ts";

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
      const novelDetailed = getNovelDetailByIdTx({ tx: trx, id: novel.id });
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
