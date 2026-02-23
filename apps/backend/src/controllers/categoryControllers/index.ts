import { Response, Request } from "express";
import { AuthRequest } from "../../types/index.ts";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoryOneService,
  getCategoriesService,
  updateCategoryService,
} from "../../services/categories/index.ts";

export const postCategoryController = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const novelData = req.body;
  try {
    const result = await createCategoryService(novelData);
    if (!result.success) {
      return res.status(result.type == "database" ? 400 : 500).json({
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

export const getCategoriesController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const page = Number(req.query.page) || 1;
    const result = await getCategoriesService(req.query, page);

    if (!result.success) {
      return res.status(result.type == "database" ? 404 : 500).json({
        message: result.message,
      });
    }

    return res.status(200).json({
      categories: result.data.categories,
      totalPage: result.data.totalPage,
      currentPage: result.data.currentPage,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getCategoryOneController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const params = req.params;

  const result = await getCategoryOneService(params.id);

  if (!result.success) {
    return res.status(result.type == "database" ? 404 : 500).json({
      message: result.message,
    });
  }

  return res.status(200).json({
    category: result.data,
  });
};

export const deleteCategoryController = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const categoryId = req.params.id;
    const result = await deleteCategoryService(categoryId);

    if (!result.success) {
      return res.status(result.type === "unknown" ? 500 : 404).json({
        type: result.type,
        message: result.message,
      });
    }
    return res.status(204).json({
      category: result.data,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const putCategoryController = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const categoryData = req.body;
  const categoryId = req.params.id;
  try {
    const result = await updateCategoryService(categoryData, categoryId);
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

    return res.status(201).json(result.data);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
