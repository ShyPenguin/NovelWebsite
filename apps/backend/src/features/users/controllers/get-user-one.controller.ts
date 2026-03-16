import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.js";
import { getUserOneService } from "../services/get-user-one.service.js";

export const getUserOneController = getOneControllerFactory({
  service: getUserOneService,
});
