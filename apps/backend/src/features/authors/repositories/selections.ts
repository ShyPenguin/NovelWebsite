import { AuthorTable } from "@/infrastructure/db/schemas/authors.ts";
import { NovelTable } from "@/infrastructure/db/schemas/novels.ts";
import type {
  AuthorThumbnailDTO,
  AuthorSelectDTO,
  AuthorDetailDTO,
} from "@repo/contracts/dto/author";
import { sql } from "drizzle-orm";

const getAuthorNovels = sql<{ id: string; title: string }[]>`(
  SELECT COALESCE(
    json_agg(
      jsonb_build_object(
        'id', ${NovelTable.id},
        'title', ${NovelTable.title}
      )
    ),
    '[]'::json
  )
  FROM ${NovelTable}
  WHERE ${NovelTable.authorId} = ${AuthorTable.id}
)`.as("novels");

export const authorSelectMap = {
  detail: {
    id: AuthorTable.id,
    name: AuthorTable.name,
    novels: getAuthorNovels,
  } satisfies Record<keyof AuthorDetailDTO, unknown>,
  thumbnail: {
    id: AuthorTable.id,
    name: AuthorTable.name,
  } satisfies Record<keyof AuthorThumbnailDTO, unknown>,
} satisfies Record<AuthorSelectDTO, unknown>;
