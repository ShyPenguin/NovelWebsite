import { AuthRequest } from "@/types/index.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { Response } from "express";

export const putControllerFactory =
  <T, TForm>({
    service,
  }: {
    service: ({
      form,
      id,
      user,
    }: {
      form: TForm;
      id: string;
      user: UserSession;
    }) => Promise<T>;
  }) =>
  async (req: AuthRequest, res: Response): Promise<any> => {
    const id = req.params.id;
    const result = await service({
      id: typeof id !== "string" ? id[0] : id,
      form: req.body,
      user: req.user,
    });

    return res.status(200).json({ ok: true, data: result });
  };
