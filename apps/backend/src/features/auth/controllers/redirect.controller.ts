import { Request, Response } from "express";
import { getOAuthClient } from "@/infrastructure/oauth-providers/base.ts";
import { createCookieWrapper } from "@/shared/utils/cookies-function.ts";
import { providerSchema } from "@/shared/types/index.ts";

export const redirectOAuthURL = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { provider } = providerSchema.parse(req.params);
  const oAuthClient = getOAuthClient(provider);
  const cookies = createCookieWrapper(req, res);

  const returnTo = req.query.returnTo as string;
  res.redirect(oAuthClient!.createAuthUrl(cookies, returnTo));
};
