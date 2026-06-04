import {
  ChapterTable,
  ChapterTableSelect,
} from "@/infrastructure/db/schemas/chapters.js";
import { and, eq } from "drizzle-orm";

const whereNumber = ({
  id,
  number,
}: {
  id: ChapterTableSelect["novelId"];
  number: ChapterTableSelect["chapterNumber"];
}) => {
  return and(
    eq(ChapterTable.novelId, id),
    eq(ChapterTable.chapterNumber, number),
  );
};
export const chapterWhereMap = {
  id: ({ id }: { id: string }) => eq(ChapterTable.id, id),
  number: whereNumber,
};

export type ChapterWhereMapType = typeof chapterWhereMap;
export type ChapterWhere = keyof typeof chapterWhereMap;
