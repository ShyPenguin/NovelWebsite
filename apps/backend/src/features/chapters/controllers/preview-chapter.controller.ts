import { Response } from "express";

import {
  ChapterFormSchema,
  ChapterPreviewSchema,
} from "@repo/contracts/schemas/chapter";
import { previewChapterWithAuthService } from "@/features/chapters/services/preview-chapter-with-auth.service.ts";
import { AuthRequest } from "@/shared/types/index.ts";

export const previewChapterController = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  // publishedAt not included because it's already parsed in the middleware
  // it should be in Date type already
  const { publishedAt, ...data } = req.body;
  const parsedData = ChapterFormSchema.parse(data);
  const { title, contentHtml } = await previewChapterWithAuthService({
    docUrl: parsedData.sourceDocUrl,
    user: req.user,
  });

  const encodeData = ChapterPreviewSchema.encode({
    ...parsedData,
    title,
    contentHtml,
    publishedAt,
  });
  return res.status(200).json({
    ok: true,
    data: encodeData,
  });
};
