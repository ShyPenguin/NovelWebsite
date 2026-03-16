import { Request, Response } from "express";
import { getNovelLatestChaptersService } from "../services/get-novel-latest-chapters.service.js";

export const getLatestChaptersController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const result = await getNovelLatestChaptersService();
  return res.status(200).json({ ok: true, data: result });
};
