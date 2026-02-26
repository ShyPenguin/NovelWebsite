import { createCookieWrapper } from "@/shared/utils/cookies-function.ts";
import { Request, Response } from "express";
import { removeUserFromSession } from "../session.service.ts";

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const cookie = createCookieWrapper(req, res);
    await removeUserFromSession(cookie);
    return res.status(201).json("log out successfully");
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
