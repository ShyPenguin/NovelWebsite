import { db } from "@/db/index.ts";
import { DbClientType, DbPoolType } from "@/db/type.ts";
import { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { deleteNovelService } from "./deleteNovelService.ts";
import { deleteImageFromSupabase } from "../supabase/supabaseDelete.ts";
import { UserSession } from "@repo/contracts/dto/auth";

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
