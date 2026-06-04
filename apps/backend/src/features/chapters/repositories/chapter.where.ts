import {
  ChapterTable,
  ChapterTableSelect,
} from "@/infrastructure/db/schemas/chapters.js";
import { and, eq } from "drizzle-orm";

const whereNumber = ({
  id,
  chapterNumber,
}: {
  id: ChapterTableSelect["novelId"];
  chapterNumber: ChapterTableSelect["chapterNumber"];
}) => {
  return and(
    eq(ChapterTable.novelId, id),
    eq(ChapterTable.chapterNumber, chapterNumber),
  );
};
export const chapterWhereMap = {
  id: ({ id }: { id: string }) => eq(ChapterTable.id, id),
  number: whereNumber,
};

export type ChapterWhereMapType = typeof chapterWhereMap;
export type ChapterWhere = keyof typeof chapterWhereMap;
