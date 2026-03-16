import { AuthorDetailDTO } from "@repo/contracts/dto/author";
import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.js";
import { getAuthorOneService } from "../services/get-author-one.service.js";

export const getAuthorOneController = getOneControllerFactory<
  { id: string },
  AuthorDetailDTO
>({
  service: getAuthorOneService,
});
