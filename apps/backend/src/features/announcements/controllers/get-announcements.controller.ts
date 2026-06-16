import { AnnouncementListDTO } from "@repo/contracts/dto/announcement";
import { Response, Request } from "express";
import { GetAnnouncementsServices } from "../services/get-announcements.service.js";
import { AnnouncementQuerySchema } from "../announcement.schema.js";

export const getAnnouncementsController = ({
  type,
}: {
  type: AnnouncementListDTO;
}) => {
  return async (req: Request, res: Response): Promise<any> => {
    const page = Number(req.query.page) ?? null;
    const pageSize = Number(req.query.pageSize) ?? null;
    const query = AnnouncementQuerySchema.parse(req.query);

    const service = GetAnnouncementsServices[type][page ? "paginated" : "list"];
    const result = page
      ? await (
          service as (typeof GetAnnouncementsServices)[typeof type]["paginated"]
        )({
          query,
          page,
          pageSize,
        })
      : await (
          service as (typeof GetAnnouncementsServices)[typeof type]["list"]
        )({
          query,
        });

    return res.status(200).json({ ok: true, data: result });
  };
};
