import { providerSchema } from "../../types/index.ts";
import { Request, Response } from "express";
import { getOAuthClient } from "../../services/oauth/base.ts";
import { createCookieWrapper } from "../../utils/cookiesFunction.ts";

export const redirectOAuthURL = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { provider } = providerSchema.parse(req.params);
  const oAuthClient = getOAuthClient(provider);
  const cookies = createCookieWrapper(req, res);

  const returnTo = req.query.returnTo as string;
  res.redirect(oAuthClient!.createAuthUrl(cookies, returnTo));
};
