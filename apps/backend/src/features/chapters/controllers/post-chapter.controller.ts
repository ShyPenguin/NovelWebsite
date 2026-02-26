import { createChapterService } from "@/features/chapters/services/create-chapter.service.ts";
import { ChapterFormParsedDTO } from "@repo/contracts/dto/chapter";
import { UserSession } from "@repo/contracts/dto/auth";
import { postControllerFactory } from "@/shared/factories/controller/post.controller.ts";

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
