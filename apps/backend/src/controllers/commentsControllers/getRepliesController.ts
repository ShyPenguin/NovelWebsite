import { Request, Response } from "express";
import { getRepliesService } from "../../services/comments/getRepliesService.ts";

export const getRepliesController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const id = req.params.id;
  const page = Number(req.query.page) || 1;

  try {
    const result = await getRepliesService(id, page);

    if (!result.success) {
      return res
        .status(
          result.type == "database"
            ? 404
            : result.type == "validation"
            ? 400
            : 500
        )
        .json({
          message: result.message,
        });
    }

    return res.status(200).json({
      comments: result.data.comments,
      totalPage: result.data.totalPage,
      currentPage: result.data.currentPage,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
