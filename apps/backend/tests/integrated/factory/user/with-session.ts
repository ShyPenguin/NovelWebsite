import { UserTable } from "../../../../src/db/schemas/users.ts";
import { randomBytes } from "crypto";
import { sessionSchema } from "../../../../src/types/index.ts";
import { SESSION_EXPIRATION_SECONDS } from "../../../../src/constants/index.ts";
import { createUserOauthAccountTx } from "../../../../src/repositories/userOauthAccount/create.ts";
import { redisDb, testDb } from "../../db/db-test.ts";
import { OAuthProvider } from "../../../../src/db/schemas/oauthProviders.ts";
import { createUserTx } from "../../../../src/repositories/users/create.ts";
import { DbPoolType } from "../../../../src/db/type.ts";
import { SessionStore } from "../../db/redis-test.ts";

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
