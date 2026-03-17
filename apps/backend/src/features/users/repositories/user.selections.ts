import { NovelTable } from "@/infrastructure/db/schemas/novels.js";
import { UserOAuthAccountTable } from "@/infrastructure/db/schemas/oauth-providers.js";
import {
  getUserColumns,
  UserTable,
} from "@/infrastructure/db/schemas/users.js";
import { OAuthProviders } from "@repo/contracts/dto/auth";
import {
  UserDetailDTO,
  UserSelectDTO,
  UserThumbnailDTO,
} from "@repo/contracts/dto/user";
import { eq, sql } from "drizzle-orm";

export const getOAuthProviders = sql<OAuthProviders[]>`(
  SELECT COALESCE(
    json_agg(
        ${UserOAuthAccountTable.provider}
    ),
    '[]'::json
  )
  FROM ${UserOAuthAccountTable}
  WHERE ${eq(UserOAuthAccountTable.userId, UserTable.id)}
)`.as("oAuthProviders");

const getTranslatorNovels = sql<
  { id: string; title: string; coverImageUrl: string; description: string }[]
>`(
  SELECT COALESCE(
    json_agg(
      jsonb_build_object(
        'id', ${NovelTable.id},
        'title', ${NovelTable.title},
        'coverImageUrl', ${NovelTable.coverImageUrl},
        'description', ${NovelTable.description}
      )
    ),
    '[]'::json
  )
  FROM ${NovelTable}
  WHERE ${eq(NovelTable.translatorId, UserTable.id)}
)`.as("novels");

export const userSelectMap = {
  detail: {
    ...getUserColumns(),
    oAuthProviders: getOAuthProviders,
    novels: getTranslatorNovels,
  } satisfies Record<keyof UserDetailDTO, unknown>,
  thumbnail: {
    ...getUserColumns(),
    oAuthProviders: getOAuthProviders,
  } satisfies Record<keyof UserThumbnailDTO, unknown>,
} satisfies Record<UserSelectDTO, unknown>;
