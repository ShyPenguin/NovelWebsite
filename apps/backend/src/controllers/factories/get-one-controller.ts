import { Request, Response } from "express";

export const getOneControllerFactory =
  <T>({ service }: { service: ({ id }: { id: string }) => Promise<T> }) =>
  async (req: Request, res: Response): Promise<any> => {
    const params = req.params;
    const result = await service({
      id: Array.isArray(params.id) ? params.id[0] : params.id,
    });

    return res.status(200).json({
      ok: true,
      data: result,
    });
  };
