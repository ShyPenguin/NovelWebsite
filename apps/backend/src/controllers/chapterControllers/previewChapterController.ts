import { Request, Response } from "express";
import { previewChapterService } from "@/services/chapters/index.ts";
import {
  ChapterFormSchema,
  ChapterPreviewSchema,
} from "@repo/contracts/schemas/chapter";

export const previewChapterController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  // publishedAt not included because it's already parsed in the middleware
  // it should be in Date type already
  const { publishedAt, ...data } = req.body;
  const parsedData = ChapterFormSchema.parse(data);
  const { title, contentHtml } = await previewChapterService(
    parsedData.sourceDocUrl,
  );

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
