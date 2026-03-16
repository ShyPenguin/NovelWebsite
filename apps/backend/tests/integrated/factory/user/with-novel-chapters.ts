import { ChapterTableInsert } from "@/infrastructure/db/schemas/chapters.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { UserTableInsert } from "@/infrastructure/db/schemas/users.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { createUserTx } from "@/features/users/repositories/create.repository.js";
import { createNovelWithChapters } from "../novel-with-chapters/index.js";
import { Week } from "@/infrastructure/db/schemas/novelSchedule.js";

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
