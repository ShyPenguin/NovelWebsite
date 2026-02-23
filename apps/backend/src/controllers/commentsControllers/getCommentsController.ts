import { Request, Response } from "express";
import { getCommentsService } from "../../services/comments/index.ts";

export const getCommentsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const id = req.params.id;
  const query = {
    ...req.query,
    chapterId: id,
  };

  const page = Number(req.query.page) || 1;

  try {
    const result = await getCommentsService(query, page);

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
