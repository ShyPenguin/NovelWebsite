import { Request, Response } from "express";
import { getOAuthClient } from "@/infrastructure/oauth-providers/base.js";
import { createCookieWrapper } from "@/shared/utils/cookies-function.js";
import { providerSchema } from "@/shared/types/index.js";

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
