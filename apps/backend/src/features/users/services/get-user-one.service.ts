import { getResourceByIdServiceFactory } from "@/shared/factories/service/get-resource-by-id.service.ts";
import { getUserDetailByUsernameTx } from "../repositories/get-user-one.repository.ts";

export const getUserOneService = getResourceByIdServiceFactory({
  resource: "users",
  repository: getUserDetailByUsernameTx,
});
