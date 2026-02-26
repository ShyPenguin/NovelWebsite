import { AuthorThumbnailDTO } from "@repo/contracts/dto/author";
import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.ts";
import { getAuthorOneService } from "../services/get-author-one.service.ts";

export const getAuthorOneController =
  getOneControllerFactory<AuthorThumbnailDTO>({
    service: getAuthorOneService,
  });
