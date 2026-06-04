import { Request, Response } from "express";

export const getOneControllerFactory =
  <Parameters, T>({
    service,
  }: {
    service: (params: Parameters) => Promise<T>;
  }) =>
  async (req: Request<Parameters>, res: Response) => {
    const result = await service(req.params);

    return res.status(200).json({
      ok: true,
      data: result,
    });
  };
