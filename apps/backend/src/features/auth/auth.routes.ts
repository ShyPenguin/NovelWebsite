import { Router } from "express";
import { redirectOAuthURL } from "./controllers/redirect.controller.ts";
import { login } from "./controllers/login.controller.ts";
import { logout } from "./controllers/logout.controller.ts";
import { me } from "./controllers/me.controller.ts";

const oauthRoutes = Router();

oauthRoutes.get("/redirect/:provider", redirectOAuthURL);
oauthRoutes.get("/login/:provider", login);
oauthRoutes.post("/logout", logout);
oauthRoutes.get("/me", me);
export default oauthRoutes;
