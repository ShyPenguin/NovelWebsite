import { desc, eq, sql } from "drizzle-orm";
import { chapterAccessTypes } from "@repo/contracts/fields/chapters";
import { ChapterTable } from "@/infrastructure/db/schemas/chapters.ts";
import { NovelTable } from "@/infrastructure/db/schemas/novels.ts";
import {
  Transaction,
  DbPoolType,
  DbClientType,
} from "@/infrastructure/db/type.ts";

const novelLatestChapterSelect = {
  novel: {
    id: sql`${NovelTable.id}`.as("novel_id"),
    title: sql`${NovelTable.title}`.as("novel_title"),
    coverImageUrl: sql`${NovelTable.coverImageUrl}`.as("novel_cover_image_url"),
  },
  id: sql`${ChapterTable.id}`.as("chapter_id"),
  chapterNumber: ChapterTable.chapterNumber,
  title: sql`${ChapterTable.title}`.as("chapter_title"),
  access: ChapterTable.access,
  status: ChapterTable.status,
  updatedAt: ChapterTable.updatedAt,
};

const buildBaseQuery = ({
  tx,
  access,
}: {
  tx: Transaction;
  access: (typeof chapterAccessTypes)[number];
}) => {
  return tx
    .selectDistinctOn([ChapterTable.novelId], novelLatestChapterSelect)
    .from(NovelTable)
    .innerJoin(ChapterTable, eq(ChapterTable.novelId, NovelTable.id))
    .where(eq(ChapterTable.access, access))
    .orderBy(ChapterTable.novelId, desc(ChapterTable.chapterNumber));
};
export const getAllLatestChaptersTx = async ({
  tx,
}: {
  tx: DbPoolType | DbClientType;
}) => {
  const result = await tx.transaction(async (trx) => {
    const freeSubquery = buildBaseQuery({ tx: trx, access: "free" }).as(
      "latest_free",
    );

    const free = await trx
      .select({
        novel: {
          id: freeSubquery.novel.id,
          title: freeSubquery.novel.title,
          coverImageUrl: freeSubquery.novel.coverImageUrl,
        },
        id: freeSubquery.id,
        chapterNumber: freeSubquery.chapterNumber,
        title: freeSubquery.title,
        access: freeSubquery.access,
        status: freeSubquery.status,
        updatedAt: freeSubquery.updatedAt,
      })
      .from(freeSubquery)
      .orderBy(desc(freeSubquery.updatedAt));

    const paidSubquery = buildBaseQuery({ tx: trx, access: "paid" }).as(
      "latest_paid",
    );
    const paid = await trx
      .select({
        novel: {
          id: paidSubquery.novel.id,
          title: paidSubquery.novel.title,
          coverImageUrl: paidSubquery.novel.coverImageUrl,
        },
        id: paidSubquery.id,
        chapterNumber: paidSubquery.chapterNumber,
        title: paidSubquery.title,
        access: paidSubquery.access,
        status: paidSubquery.status,
        updatedAt: paidSubquery.updatedAt,
      })
      .from(paidSubquery)
      .orderBy(desc(paidSubquery.updatedAt));

    return {
      free,
      paid,
    };
  });
  return result;
};
