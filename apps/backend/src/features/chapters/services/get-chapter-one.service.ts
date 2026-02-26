import { getResourceByIdServiceFactory } from "@/shared/factories/service/get-resource-by-id.service.ts";
import { getChapterDetailByIdTx } from "../repositories/get-chapter-by-id.repository.ts";

export const getChapterOneService = getResourceByIdServiceFactory({
  resource: "chapters",
  repository: getChapterDetailByIdTx,
});
