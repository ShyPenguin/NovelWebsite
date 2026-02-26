import { AuthRequest } from "@/shared/types/index.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { Response } from "express";

export const deleteControllerFactory =
  <T extends { id: string }>({
    service,
  }: {
    service: ({ id, user }: { id: string; user: UserSession }) => Promise<T>;
  }) =>
  async (req: AuthRequest, res: Response): Promise<any> => {
    const params = req.params;
    const result = await service({
      id: Array.isArray(params.id) ? params.id[0] : params.id,
      user: req.user,
    });

    return res.status(200).json({
      ok: true,
      data: result.id,
    });
  };
