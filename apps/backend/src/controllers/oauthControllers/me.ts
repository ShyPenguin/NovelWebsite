import { Request, Response } from "express";
import { db } from "../../db/index.ts";
import { UserTable } from "../../db/schemas/index.ts";
import { eq } from "drizzle-orm";
import { getUserFromSession } from "../../services/session/getUserFromSession.ts";
import { createCookieWrapper } from "../../utils/cookiesFunction.ts";

export const me = async (req: Request, res: Response): Promise<any> => {
  const cookie = createCookieWrapper(req, res);
  const userSession = await getUserFromSession(cookie);

  if (!userSession) {
    return res.status(401).json({
      message: "User is not logged in",
    });
  }

  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, userSession.id),
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
      imageUrl: true,
    },
  });

  if (!user) {
    return res.status(401).json(null);
  }

  return res.json(user);
};
