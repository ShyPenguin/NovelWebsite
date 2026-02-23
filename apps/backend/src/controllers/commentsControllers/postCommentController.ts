import { Response } from "express";
import { AuthRequest } from "../../types/index.ts";
import { createCommentService } from "../../services/comments/index.ts";

export function postCommentController({ reply }: { reply: boolean }) {
  return async (req: AuthRequest, res: Response): Promise<any> => {
    const commentData = reply
      ? {
          parentId: req.params.id,
          userId: req.user?.id,
          ...req.body,
        }
      : {
          chapterId: req.params.id,
          userId: req.user?.id,
          ...req.body,
        };

    try {
      const result = await createCommentService(commentData);
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
      return res.status(201).json({ comment: result.data });
    } catch (err) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
}
