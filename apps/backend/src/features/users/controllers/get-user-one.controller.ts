import { UserDetailDTO } from "@repo/contracts/dto/user";
import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.ts";
import { getUserOneService } from "../services/get-user-one.service.ts";

export const getUserOneController = getOneControllerFactory<
  { id: string },
  UserDetailDTO
>({
  service: getUserOneService,
});
