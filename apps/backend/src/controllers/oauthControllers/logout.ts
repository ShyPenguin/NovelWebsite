import { removeUserFromSession } from "../../services/session/index.ts";
import { createCookieWrapper } from "../../utils/cookiesFunction.ts";
import { Request, Response } from "express";

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const cookie = createCookieWrapper(req, res);
    await removeUserFromSession(cookie);
    return res.status(201).json("log out successfully");
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
