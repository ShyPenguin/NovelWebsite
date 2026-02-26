import { AuthRequest } from "@/shared/types/index.ts";
import { Response } from "express";
import { updateNovelCoverService } from "../services/update-novel-cover.service.ts";

export const patchNovelCoverController = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await updateNovelCoverService({
    id,
    user: req.user,
    file: req.file,
  });

  return res.status(200).json({
    ok: true,
    data: result,
  });
};
