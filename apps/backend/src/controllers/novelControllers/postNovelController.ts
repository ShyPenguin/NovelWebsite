import { Response } from "express";
import { AuthRequest } from "../../types/index.ts";
import { createNovelService } from "../../services/novels/createNovelService.ts";
import { NovelFormSchema } from "@repo/contracts/schemas/novel";

export const postNovelController = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  const novel = NovelFormSchema.parse(req.body);
  const result = await createNovelService({
    data: novel,
    user: req.user,
  });
  return res.status(201).json({ ok: true, data: result });
};
