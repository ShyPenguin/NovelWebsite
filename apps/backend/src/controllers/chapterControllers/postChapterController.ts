import { Response } from "express";
import { AuthRequest } from "../../types/index.ts";
import { createChapterService } from "@/services/chapters/createChapterService.ts";

export const postChapterController = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  const novelId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  const result = await createChapterService({ form: req.body, novelId });
  return res.status(201).json({ ok: true, data: result });
};
