import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/index.ts";
import { UserTable } from "@/infrastructure/db/schemas/users.ts";
import { createCookieWrapper } from "@/shared/utils/cookies-function.ts";
import { getUserFromSession } from "../session.service.ts";

export const me = async (req: Request, res: Response): Promise<any> => {
  const cookie = createCookieWrapper(req, res);
  const userSession = await getUserFromSession(cookie);

  if (!userSession) {
    return res.status(401).json({
      message: "You're not logged in",
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
