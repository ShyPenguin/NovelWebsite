import { UserOAuthAccountTable } from "@/infrastructure/db/schemas/oauthProviders.ts";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.ts";

export const createUserOauthAccountTx = CreateResourceFactory<
  typeof UserOAuthAccountTable
>({
  table: UserOAuthAccountTable,
});
