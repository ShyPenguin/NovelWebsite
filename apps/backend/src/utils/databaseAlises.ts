import { alias } from "drizzle-orm/pg-core";
import { ChapterTable } from "../db/schemas/index.ts";

export const chapterAlias = alias(ChapterTable, "c");
