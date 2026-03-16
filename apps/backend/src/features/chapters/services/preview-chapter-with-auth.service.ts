import { requirePermission } from "@/shared/utils/require-permission.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { previewChapterService } from "./preview-chapter.service.js";

export const previewChapterWithAuthService = async ({
  docUrl,
  user,
}: {
  docUrl: string;
  user: UserSession;
}) => {
  requirePermission({
    user,
    resource: "chapters",
    action: "preview",
    ctx: {},
  });

  return await previewChapterService(docUrl);
};
