import { ChapterTable } from "@/infrastructure/db/schemas/chapters.ts";
import { alias } from "drizzle-orm/pg-core";

export const chapterAlias = alias(ChapterTable, "c");
