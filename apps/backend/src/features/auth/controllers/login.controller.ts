import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import {
  OAuthProvider,
  UserOAuthAccountTable,
  UserTable,
} from "@/infrastructure/db/schemas/index.ts";
import {
  getOAuthClient,
  OAuthUser,
} from "@/infrastructure/oauth-providers/base.ts";
import { providerSchema } from "@/shared/types/index.ts";
import { createCookieWrapper } from "@/shared/utils/cookies-function.ts";
import { db } from "@/infrastructure/db/index.ts";
import { sessionSchema } from "@repo/contracts/schemas/auth";
import { createUserSession } from "../session.service.ts";

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

    const returnTo = cookies.get("oauthReturnTo")?.value ?? "/";

    // cleanup
    cookies.set("oauthReturnTo", "", { expires: 0 });

    // const data = {
    //   id: oAuthUser.id,
    //   name: oAuthUser.name,
    //   email: oAuthUser.email,
    //   role: user.role,
    // };

    return res.redirect(
      `${process.env.FRONTEND_URL}/${returnTo ? returnTo : ""}`,
    );
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
  provider: OAuthProvider,
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
