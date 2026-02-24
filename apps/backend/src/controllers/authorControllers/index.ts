import { Response, Request } from "express";
import { AuthRequest } from "../../types/index.ts";
import {
  deleteAuthorService,
  updateAuthorService,
} from "../../services/authors/index.ts";

export const deleteAuthorController = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    const authorId = req.params.id;
    const result = await deleteAuthorService(authorId);

    if (!result.success) {
      return res.status(result.type === "unknown" ? 500 : 404).json({
        type: result.type,
        message: result.message,
      });
    }
    return res.status(204).json({
      author: result.data,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const putAuthorController = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  const authorData = req.body;
  const authorId = req.params.id;
  try {
    const result = await updateAuthorService(authorData, authorId);
    if (!result.success) {
      return res
        .status(
          result.type == "database"
            ? 404
            : result.type == "validation"
              ? 400
              : 500,
        )
        .json({
          message: result.message,
        });
    }

    return res.status(201).json(result.data);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
