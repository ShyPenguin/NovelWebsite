import { Response, Request } from "express";
import { UserListDTO } from "@repo/contracts/dto/user";
import { UserQuerySchema } from "@/features/users/user.schema.js";
import { GetUsersServices } from "../services/get-users.service.js";

export const getUsersController = ({ type }: { type: UserListDTO }) => {
  return async (req: Request, res: Response): Promise<any> => {
    const page = Number(req.query.page) ?? null;
    const pageSize = Number(req.query.pageSize) ?? null;

    const query = UserQuerySchema.parse(req.query);
    const service = GetUsersServices[type][page ? "paginated" : "list"];

    const result = page
      ? await (service as (typeof GetUsersServices)[typeof type]["paginated"])({
          query,
          page,
          pageSize,
        })
      : await (service as (typeof GetUsersServices)[typeof type]["list"])({
          query,
        });
    return res.status(200).json({ ok: true, data: result });
  };
};
