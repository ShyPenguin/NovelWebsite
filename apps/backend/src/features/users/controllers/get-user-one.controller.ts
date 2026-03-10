import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.ts";
import { getUserOneService } from "../services/get-user-one.service.ts";

export const getUserOneController = getOneControllerFactory({
  service: getUserOneService,
});
