import { Request, Response } from "express";

export const getOneControllerFactory =
  <Params extends Record<string, string>, T>({
    service,
  }: {
    service: (params: Params) => Promise<T>;
  }) =>
  async (req: Request<Params>, res: Response) => {
    const result = await service(req.params);

    return res.status(200).json({
      ok: true,
      data: result,
    });
  };
