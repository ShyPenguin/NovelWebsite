import { requirePermission } from "@/shared/utils/require-permission.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { previewChapterService } from "./preview-chapter.service.ts";

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
  });

  return await previewChapterService(docUrl);
};
