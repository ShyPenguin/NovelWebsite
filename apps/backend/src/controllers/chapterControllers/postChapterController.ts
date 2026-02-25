import { createChapterService } from "@/services/chapters/createChapterService.ts";
import { postControllerFactory } from "../factories/post-controller.ts";
import { ChapterFormParsedDTO } from "@repo/contracts/dto/chapter";
import { UserSession } from "@repo/contracts/dto/auth";

export const postChapterController = postControllerFactory({
  service: ({
    form,
    parentId,
    user,
  }: {
    form: ChapterFormParsedDTO;
    parentId: string;
    user: UserSession;
  }) => createChapterService({ form, user, novelId: parentId }),
});
