import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.ts";
import { getUserDetailByUsernameTx } from "../repositories/get-user-one.repository.ts";

export const getUserOneService = getResourceServiceFactory({
  resource: "users",
  repository: getUserDetailByUsernameTx,
});
