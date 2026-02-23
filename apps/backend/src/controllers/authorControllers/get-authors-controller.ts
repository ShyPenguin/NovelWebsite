import { GetAuthorsServices } from "@/services/authors/getAuthors.ts";
import { AuthorListDTO } from "@repo/contracts/dto/author";
import { Response, Request } from "express";

export const getAuthorsController = ({ type }: { type: AuthorListDTO }) => {
  return async (req: Request, res: Response): Promise<any> => {
    const page = Number(req.query.page) ?? null;
    const pageSize = Number(req.query.pageSize) ?? null;
    const service = GetAuthorsServices[type][page ? "paginated" : "list"];
    const result = page
      ? await (
          service as (typeof GetAuthorsServices)[typeof type]["paginated"]
        )({
          query: req.query,
          page,
          pageSize,
        })
      : await (service as (typeof GetAuthorsServices)[typeof type]["list"])({
          query: req.query,
        });
    return res.status(200).json({ ok: true, data: result });
  };
};
