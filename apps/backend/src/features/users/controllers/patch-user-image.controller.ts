import { AuthRequest } from "@/shared/types/index.ts";
import { Response } from "express";
import { updateUserImageService } from "../services/update-user-image.service.ts";

export const patchUserImageController = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await updateUserImageService({
    id,
    user: req.user,
    file: req.file,
  });

  return res.status(200).json({
    ok: true,
    data: result,
  });
};
