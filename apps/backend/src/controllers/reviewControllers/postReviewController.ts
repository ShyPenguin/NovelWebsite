import { Response } from "express";
import { AuthRequest } from "../../types/index.ts";
import { createReviewService } from "../../services/reviews/index.ts";

export const postReviewController = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req.params.id;
  const reviewData = {
    novelId: id,
    reviewerId: req.user?.id,
    ...req.body,
  };

  try {
    const result = await createReviewService(reviewData);
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
    console.log(err);
    console.log("I got an error here in post review controller");
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
