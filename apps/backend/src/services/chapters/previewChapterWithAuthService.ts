import { requirePermission } from "@/utils/requirePermission.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { previewChapterService } from "./previewChapterService.ts";

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
