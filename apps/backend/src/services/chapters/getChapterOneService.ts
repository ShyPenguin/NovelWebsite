import { getResourceByIdServiceFactory } from "../factories/get-resource-by-id.ts";
import { getChapterDetailByIdTx } from "../../repositories/chapters/getChapterById.ts";

export const getChapterOneService = getResourceByIdServiceFactory({
  resource: "chapters",
  repository: getChapterDetailByIdTx,
});
