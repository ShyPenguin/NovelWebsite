import { Response, Request } from "express";
import { NovelListDTO } from "@repo/contracts/dto/novel";
import { NovelQuerySchema } from "@/features/novels/novel.schema.ts";
import { GetNovelsServices } from "../services/get-novels.service.ts";

export const getNovelsController = ({ type }: { type: NovelListDTO }) => {
  return async (req: Request, res: Response): Promise<any> => {
    const page = Number(req.query.page) ?? null;
    const pageSize = Number(req.query.pageSize) ?? null;
    const query = NovelQuerySchema.parse(req.query);
    const service = GetNovelsServices[type][page ? "paginated" : "list"];
    const result = page
      ? await (service as (typeof GetNovelsServices)[typeof type]["paginated"])(
          {
            query,
            page,
            pageSize,
          },
        )
      : await (service as (typeof GetNovelsServices)[typeof type]["list"])({
          query,
        });
    return res.status(200).json({ ok: true, data: result });
  };
};
