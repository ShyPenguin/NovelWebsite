import { createChapterService } from "@/services/chapters/createChapterService.ts";
import { postControllerFactory } from "../factories/post-controller.ts";
import { ChapterFormParsedDTO } from "@repo/contracts/dto/chapter";

export const postChapterController = postControllerFactory({
  service: ({
    form,
    parentId,
  }: {
    form: ChapterFormParsedDTO;
    parentId?: string;
  }) => createChapterService({ form, novelId: parentId! }),
});
