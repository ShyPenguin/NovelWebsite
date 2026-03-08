import { NextFunction, Request, Response } from "express";

export const errorResponse = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customError: boolean =
    error.constructor.name === "NodeError" ||
    error.constructor.name === "SyntaxError"
      ? false
      : true;

  if (error.statusCode == 500) {
    console.log(error);
  }
  res.status(error.statusCode || 500).json({
    ok: false,
    error: {
      type: customError === false ? "UnhandledError" : error.constructor.name,
      path: req.path,
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    },
  });
  next(error);
};
