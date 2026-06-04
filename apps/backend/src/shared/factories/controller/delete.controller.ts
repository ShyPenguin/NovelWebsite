import { AuthRequest } from "@/shared/types/index.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { Response } from "express";

export const deleteControllerFactory =
  <T extends { id: string }>({
    service,
  }: {
    service: ({ id }: { id: string }, user: UserSession) => Promise<T>;
  }) =>
  async (req: AuthRequest, res: Response): Promise<any> => {
    const params = req.params;
    const result = await service(
      { id: Array.isArray(params.id) ? params.id[0] : params.id },
      req.user,
    );

    return res.status(200).json({
      ok: true,
      data: result.id,
    });
  };

// {
//     tx = db,
//     getParams,
//     user,
//   }: {
//     tx?: DbClientType | DbPoolType;
//     getParams: GetParams;
//     user: UserSession;
//   }
