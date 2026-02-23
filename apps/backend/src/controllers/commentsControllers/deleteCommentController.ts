import { Response } from "express";
import { AuthRequest } from "../../types/index.ts";
import { deleteCommentService } from "../../services/comments/index.ts";

export const deleteCommentController = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const chapterId = req.params.id;
    const result = await deleteCommentService(chapterId);

    if (!result.success) {
      return res.status(result.type === "database" ? 404 : 500).json({
        type: result.type,
        message: result.message,
      });
    }
    return res.status(204).json({
      review: result.data,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
