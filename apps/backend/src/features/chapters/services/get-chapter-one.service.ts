import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.js";
import { getChapterDetailByIdTx } from "../repositories/get-chapter-one.repository.js";

export const getChapterOneService = getResourceServiceFactory({
  resource: "chapters",
  repository: getChapterDetailByIdTx,
});
