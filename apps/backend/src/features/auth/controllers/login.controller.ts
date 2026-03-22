import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import {
  UserOAuthAccountTable,
  UserTable,
} from "@/infrastructure/db/schemas/index.js";
import {
  getOAuthClient,
  OAuthUser,
} from "@/infrastructure/oauth-providers/base.js";
import { providerSchema } from "@/shared/types/index.js";
import { createCookieWrapper } from "@/shared/utils/cookies-function.js";
import { db } from "@/infrastructure/db/index.js";
import { sessionSchema } from "@repo/contracts/schemas/auth";
import { createUserSession } from "../session.service.js";
import { OAuthProviders } from "@repo/contracts/dto/auth";

export const login = async (req: Request, res: Response): Promise<any> => {
  const { provider } = providerSchema.parse(req.params);
  const { code, state } = req.query;
  if (typeof code !== "string" || typeof state !== "string") {
    res.redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again.",
      )}`,
    );
  }

  const oAuthClient = getOAuthClient(provider);
  const cookies = createCookieWrapper(req, res);

  try {
    const oAuthUser = await oAuthClient!.fetchUser(
      code as string,
      state as string,
      cookies,
    );

    const user = await connectUserToAccount(oAuthUser, provider);
    await createUserSession(sessionSchema.parse(user), cookies);

    const returnTo = cookies.get("oauthReturnTo")?.value ?? "";

    // cleanup
    cookies.set("oauthReturnTo", "", { maxAge: 0 });

    return res.redirect(301, `${process.env.FRONTEND_URL}${returnTo}`);
  } catch (error) {
    res.redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again.",
      )}`,
    );
  }
};

function connectUserToAccount(
  { id, email, name, imageUrl }: OAuthUser,
  provider: OAuthProviders,
) {
  return db.transaction(async (trx) => {
    let user = await trx.query.UserTable.findFirst({
      where: eq(UserTable.email, email),
      columns: { id: true, role: true },
    });

    if (user == null) {
      const [newUser] = await trx
        .insert(UserTable)
        .values({
          email: email,
          name: name,
          username: name,
          imageUrl: imageUrl,
        })
        .returning({
          id: UserTable.id,
          role: UserTable.role,
        });
      user = newUser;
    }

    await trx
      .insert(UserOAuthAccountTable)
      .values({
        provider,
        providerAccountId: id,
        userId: user.id,
      })
      .onConflictDoNothing();

    return user;
  });
}
