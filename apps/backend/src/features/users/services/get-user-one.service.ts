import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.js";
import { getUserDetailByUsernameTx } from "../repositories/get-user-one.repository.js";

export const getUserOneService = getResourceServiceFactory({
  resource: "users",
  repository: getUserDetailByUsernameTx,
});
