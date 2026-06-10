import { Response } from "express";
import { AuthRequest } from "@/shared/types/index.js";
import { GetBookmarksServices } from "../services/get-bookmarks.service.js";

const type = "detail";
export const getBookmarksController = async (
  req: AuthRequest,
  res: Response,
) => {
  const id = req.user.id;

  const page = Number(req.query.page) ?? null;
  const pageSize = Number(req.query.pageSize) ?? null;
  const service = GetBookmarksServices[type][page ? "paginated" : "list"];
  const result = page
    ? await (
        service as (typeof GetBookmarksServices)[typeof type]["paginated"]
      )({
        id,
        query: req.query,
        page,
        pageSize,
      })
    : await (service as (typeof GetBookmarksServices)[typeof type]["list"])({
        id,
        query: req.query,
      });
  return res.status(200).json({ ok: true, data: result });
};
