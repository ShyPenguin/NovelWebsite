import { db } from "@/infrastructure/db/index.ts";
import { DbClientType, DbPoolType } from "@/infrastructure/db/type.ts";
import { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { deleteNovelService } from "./delete-novel.service.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { deleteImageFromSupabase } from "@/infrastructure/supabase/repository/supabaseDelete.ts";

export const deleteNovelWithAssetsService = async ({
  tx = db,
  id,
  user,
}: {
  tx?: DbClientType | DbPoolType;
  id: NovelDetailDTO["id"];
  user: UserSession;
}) => {
  const novel = await deleteNovelService({
    id,
    user,
  });

  if (process.env.NODE_ENV !== "test" && novel.coverImagePath) {
    await deleteImageFromSupabase(novel.coverImagePath);
  }

  return novel;
};
