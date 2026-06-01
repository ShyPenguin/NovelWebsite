import {
  NovelTable,
  NovelTableInsert,
} from "@/infrastructure/db/schemas/novels.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";
import { generateUniqueSlug } from "@/shared/utils/generateUniqueSlug.js";

export const createNovelTx = async ({
  tx,
  form,
}: {
  tx: DbExecTypes;
  form: Omit<NovelTableInsert, "slug">;
}) => {
  const slug = await generateUniqueSlug({
    tx,
    table: NovelTable,
    value: form.title,
    slugColumn: NovelTable.slug,
  });

  return CreateResourceFactory({
    table: NovelTable,
  })({
    tx,
    form: {
      ...form,
      slug,
    },
  });
};
