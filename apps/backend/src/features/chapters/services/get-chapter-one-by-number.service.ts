import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.js";
import { getChapterDetailByNumberTx } from "../repositories/get-chapter-one.repository.js";

export const getChapterOneByNumberService = getResourceServiceFactory({
  resource: "chapters",
  repository: getChapterDetailByNumberTx,
});
