import { COOKIE_SESSION_KEY } from "../../constants/index.ts";
import { Cookies } from "../../types/index.ts";
import { getUserSessionById } from "./getUserSessionById.ts";

export const getUserFromSession = async (cookies: Pick<Cookies, "get">) => {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;
  return getUserSessionById(sessionId);
};
