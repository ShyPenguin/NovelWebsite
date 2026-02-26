import { AuthorThumbnailDTO } from "@repo/contracts/dto/author";
import { getOneControllerFactory } from "../factories/get-one-controller.ts";
import { getAuthorOneService } from "@/services/authors/getAuthorOneService.ts";

export const getAuthorOneController =
  getOneControllerFactory<AuthorThumbnailDTO>({
    service: getAuthorOneService,
  });
