import { SESSION_EXPIRATION_SECONDS } from "@/shared/constants/index.js";
import { UserTable } from "@/infrastructure/db/schemas/users.js";
import { DbPoolType } from "@/infrastructure/db/type.js";
import { createUserOauthAccountTx } from "@/features/auth/repositories/create.repository.js";
import { createUserTx } from "@/features/users/repositories/create.repository.js";
import { sessionSchema } from "@repo/contracts/schemas/auth";
import { randomBytes } from "crypto";
import { testDb, redisDb } from "tests/integrated/db/db-test.js";
import { SessionStore } from "@/infrastructure/cache/redis-local.js";
import { OAuthProviders } from "@repo/contracts/dto/auth";

export const mockCreateUserWithSession = (provider: OAuthProviders) => {
  return async (
    userData: typeof UserTable.$inferInsert,
    providerAccountId: string,
    psqlDb: DbPoolType = testDb,
    redisClient: SessionStore = redisDb,
  ): Promise<{
    user: typeof UserTable.$inferSelect;
    sessionId: string;
  }> => {
    const user = await createUserTx({
      tx: psqlDb,
      form: userData,
    });

    await createUserOauthAccountTx({
      tx: psqlDb,
      form: {
        userId: user.id,
        provider: provider,
        providerAccountId: providerAccountId,
      },
    });

    const sessionId = randomBytes(512).toString("hex").normalize();
    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
      ex: SESSION_EXPIRATION_SECONDS,
    });

    return {
      user,
      sessionId,
    };
  };
};

export const mockCreateUserWithSessionGoogle =
  mockCreateUserWithSession("google");
