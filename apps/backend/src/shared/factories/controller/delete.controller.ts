import { AuthRequest } from "@/shared/types/index.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { Response } from "express";

export const deleteControllerFactory =
  <T, Params>({
    service,
  }: {
    service: (params: Params, user: UserSession) => Promise<T>;
  }) =>
  async (req: AuthRequest, res: Response): Promise<any> => {
    const params = req.params;
    await service(params as Params, req.user);

    return res.status(204).send();
  };
