import { Router } from "express";
import { redirectOAuthURL } from "./controllers/redirect.controller.js";
import { login } from "./controllers/login.controller.js";
import { logout } from "./controllers/logout.controller.js";
import { me } from "./controllers/me.controller.js";

const oauthRoutes = Router();

oauthRoutes.get("/redirect/:provider", redirectOAuthURL);
oauthRoutes.get("/login/:provider", login);
oauthRoutes.post("/logout", logout);
oauthRoutes.get("/me", me);
export default oauthRoutes;
