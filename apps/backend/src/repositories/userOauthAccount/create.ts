import { UserOAuthAccountTable } from "../../db/schemas/oauthProviders.ts";
import { CreateResourceFactory } from "../factories/create.ts";

export const createUserOauthAccountTx = CreateResourceFactory<
  typeof UserOAuthAccountTable
>({
  table: UserOAuthAccountTable,
});
