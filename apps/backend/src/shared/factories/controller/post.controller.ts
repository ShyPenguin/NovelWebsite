import { AuthRequest } from "@/shared/types/index.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { Response } from "express";

export const postControllerFactory =
  <TResponse, TForm>({
    service,
  }: {
    service: (args: {
      form: TForm;
      user: UserSession;
      parentId: string;
    }) => Promise<TResponse>;
  }) =>
  async (req: AuthRequest, res: Response): Promise<Response> => {
    const result = await service({
      form: req.body as TForm,
      parentId: Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
      user: req.user,
    });

    return res.status(201).json({ ok: true, data: result });
  };
