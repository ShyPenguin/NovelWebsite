import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.ts";
import { getChapterDetailByIdTx } from "../repositories/get-chapter-one.repository.ts";

export const getChapterOneService = getResourceServiceFactory({
  resource: "chapters",
  repository: getChapterDetailByIdTx,
});
