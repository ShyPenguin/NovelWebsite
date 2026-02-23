import { Response, Request } from "express";
import { GetNovelChaptersServices } from "../../services/chapters/getChaptersService.ts";
import { ChapterListDTO } from "@repo/contracts/dto/chapter";

export const getChaptersController = ({ type }: { type: ChapterListDTO }) => {
  return async (req: Request, res: Response): Promise<any> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const page = Number(req.query.page) ?? null;
    const pageSize = Number(req.query.pageSize) ?? null;
    const service = GetNovelChaptersServices[type][page ? "paginated" : "list"];
    const result = page
      ? await (
          service as (typeof GetNovelChaptersServices)[typeof type]["paginated"]
        )({
          id,
          query: req.query,
          page,
          pageSize,
        })
      : await (
          service as (typeof GetNovelChaptersServices)[typeof type]["list"]
        )({
          id,
          query: req.query,
        });
    return res.status(200).json({ ok: true, data: result });
  };
};
