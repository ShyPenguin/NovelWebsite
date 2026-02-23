import { Response } from "express";
import { AuthRequest } from "../../types/index.ts";
import { updateReviewService } from "../../services/reviews/index.ts";

export const putReviewController = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const reviewData = req.body;
  const id = req.params.id;

  try {
    const result = await updateReviewService(reviewData, id);
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

    return res.status(201).json({ review: result.data });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
