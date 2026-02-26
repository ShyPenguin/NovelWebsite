import { SESSION_EXPIRATION_SECONDS } from "@/shared/constants/index.ts";
import { OAuthProvider } from "@/infrastructure/db/schemas/oauthProviders.ts";
import { UserTable } from "@/infrastructure/db/schemas/users.ts";
import { DbPoolType } from "@/infrastructure/db/type.ts";
import { createUserOauthAccountTx } from "@/features/auth/repositories/create.repository.ts";
import { createUserTx } from "@/features/users/repositories/create.ts";
import { sessionSchema } from "@repo/contracts/schemas/auth";
import { randomBytes } from "crypto";
import { testDb, redisDb } from "tests/integrated/db/db-test.ts";
import { SessionStore } from "tests/integrated/db/redis-test.ts";

export const mockCreateUserWithSession = (provider: OAuthProvider) => {
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
