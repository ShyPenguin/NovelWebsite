import { ChapterTableInsert } from "@/infrastructure/db/schemas/chapters.ts";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { UserTableInsert } from "@/infrastructure/db/schemas/users.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { createUserTx } from "@/features/users/repositories/create.repository.ts";
import { createNovelWithChapters } from "../novel-with-chapters/index.ts";
import { Week } from "@/infrastructure/db/schemas/novelSchedule.ts";

export const createUserWithNovelChapters = async ({
  tx,
  user,
  novel,
  authorId,
  schedule,
  categories,
  chapters,
}: {
  tx: DbExecTypes;
  user: UserTableInsert;
  novel: NovelTableInsert;
  authorId: string;
  schedule: Week[];
  categories: string[];
  chapters: ChapterTableInsert[];
}) => {
  const createdUser = await createUserTx({
    tx,
    form: user,
  });

  const novelWithChapters = await createNovelWithChapters({
    tx,
    novel,
    authorId,
    translatorId: createdUser.id,
    schedule,
    categories,
    chapters,
  });

  return {
    user: createdUser,
    novel: novelWithChapters,
  };
};
