import { UserOAuthAccountTable } from "@/infrastructure/db/schemas/oauth-providers.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";

export const createUserOauthAccountTx = CreateResourceFactory<
  typeof UserOAuthAccountTable
>({
  table: UserOAuthAccountTable,
});
