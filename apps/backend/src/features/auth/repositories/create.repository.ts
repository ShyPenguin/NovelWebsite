import { UserOAuthAccountTable } from "@/infrastructure/db/schemas/oauthProviders.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";

export const createUserOauthAccountTx = CreateResourceFactory<
  typeof UserOAuthAccountTable
>({
  table: UserOAuthAccountTable,
});
