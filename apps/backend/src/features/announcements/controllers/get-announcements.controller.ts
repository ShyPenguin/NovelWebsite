import { AnnouncementListDTO } from "@repo/contracts/dto/announcement";
import { Response, Request } from "express";
import { GetAnnouncementsServices } from "../services/get-announcements.service.js";

export const getAnnouncementsController = ({
  type,
}: {
  type: AnnouncementListDTO;
}) => {
  return async (req: Request, res: Response): Promise<any> => {
    const page = Number(req.query.page) ?? null;
    const pageSize = Number(req.query.pageSize) ?? null;
    const service = GetAnnouncementsServices[type][page ? "paginated" : "list"];
    const result = page
      ? await (
          service as (typeof GetAnnouncementsServices)[typeof type]["paginated"]
        )({
          query: req.query,
          page,
          pageSize,
        })
      : await (
          service as (typeof GetAnnouncementsServices)[typeof type]["list"]
        )({
          query: req.query,
        });
    return res.status(200).json({ ok: true, data: result });
  };
};
