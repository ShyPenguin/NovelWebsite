import {
  ChapterTableInsert,
  NovelTableInsert,
  UserTableInsert,
} from "../../../../src/db/schemas/index.ts";
import { DbExecTypes } from "../../../../src/db/type.ts";
import { createUserTx } from "../../../../src/repositories/users/create.ts";
import { WeekDay } from "../../../../src/services/novelSchedule/index.ts";
import { createNovelWithChapters } from "../novel-with-chapters/index.ts";

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
  schedule: WeekDay[];
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
