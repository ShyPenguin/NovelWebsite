import { Request, Response } from "express";
import { getReviewOneService } from "../../services/reviews/index.ts";

export const getReviewOneController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const params = req.params;

  const result = await getReviewOneService(params.id);

  if (!result.success) {
    return res.status(result.type == "database" ? 404 : 500).json({
      message: result.message,
    });
  }

  return res.status(200).json({
    review: result.data,
  });
};
